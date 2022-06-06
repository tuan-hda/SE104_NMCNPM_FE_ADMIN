import React, { useEffect, useState } from 'react'
import { Form, Input, Upload, Select, Switch, message, Modal, Tag } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'
import { useSelector } from 'react-redux'
const { Option } = Select

const categories = [
  'Combos',
  'Hamburger',
  'Chicken',
  'Rice',
  'Sides',
  'Desserts',
  'Drinks'
]

const FormProductModify = ({
  isShowing,
  onCreate,
  onCancel,
  title,
  initial
}) => {
  const [form] = Form.useForm()
  const featured = Form.useWatch('featured', form)
  // const available = Form.useWatch('available', form)
  const [loading, setLoading] = useState(false)
  const [imgUrl, setImgUrl] = useState()
  const { currentUser } = useSelector(state => state.user)

  useEffect(() => {
    if (isShowing) console.log(1)
  }, [isShowing])

  const clearFields = () => {
    setImgUrl(false)
    setLoading(false)
  }

  const handleCancel = () => {
    onCancel()
    clearFields()
    form.resetFields()
  }

  const addItem = async values => {
    try {
      const token = await currentUser.getIdToken()
      await appApi.post(
        routes.ADD_ITEM,
        routes.getAddItemBody(
          values.name,
          values.category,
          values.image,
          values.price,
          values.calories,
          values.featured
        ),
        routes.getAccessTokenHeader(token)
      )

      console.log('Success')
    } catch (err) {
      console.log(err)
    }
  }

  const updateItem = async values => {
    try {
      const token = await currentUser.getIdToken()
      await appApi.put(
        routes.UPDATE_ITEM,
        routes.getUpdateItemBody(
          initial.id,
          values.name,
          values.category,
          values.image,
          values.price,
          values.calories,
          values.featured
        ),
        routes.getAccessTokenHeader(token)
      )
      console.log('Success')
    } catch (err) {
      console.log(err)
    }
  }

  const handleResult = values => {
    if (!initial) addItem(values)
    else updateItem(values)
  }

  const onOk = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields()
        onCreate(values)
        console.log(values)
        handleResult(values)
        clearFields()
      })
      .catch(info => {
        console.log('Validate failed: ' + info)
      })
  }

  const handleUpload = info => {
    setLoading(true)

    uploadImage(info.file.originFileObj, url => {
      setLoading(false)
      setImgUrl(url)
    })
  }

  const uploadImage = (img, callback) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        callback(reader.result)
      }
    }
    reader.readAsDataURL(img)
  }

  const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'

    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    return isJpgOrPng
  }

  useEffect(() => {
    form.resetFields()
  }, [initial, form])

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8
        }}
      >
        Upload
      </div>
    </div>
  )

  return (
    <Modal
      visible={isShowing}
      title={title}
      onCancel={handleCancel}
      onOk={onOk}
      okButtonProps={{
        className: 'bg-blue-button'
      }}
      okType='primary'
    >
      <Form
        form={form}
        name='form in modal'
        labelAlign='right'
        labelCol={{ span: 4 }}
        initialValues={{
          modifier: 'public'
        }}
      >
        {/* Name */}
        <Form.Item
          name='name'
          label='Name'
          initialValue={initial?.itemName}
          rules={[
            {
              required: true,
              message: "You must enter product's name"
            }
          ]}
        >
          <Input />
        </Form.Item>

        {/* Category */}
        <Form.Item
          name='category'
          label='Category'
          initialValue={initial ? initial.typeData.value : categories[0]}
        >
          <Select>
            {categories.map((c, i) => (
              <Option value={c} key={i}>
                {c}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Price */}
        <Form.Item
          name='price'
          label='Price'
          initialValue={initial?.price.substring(2)}
          rules={[
            {
              required: true,
              message: "You must enter product's price!"
            },
            {
              pattern: /^[0-9]*$/,
              message: 'Price must be an integer'
            }
          ]}
        >
          <Input className='w-full' />
        </Form.Item>

        {/* Featured */}
        <Form.Item
          name='featured'
          label='Featured'
          initialValue={initial ? initial.featured : false}
        >
          <Switch
            className={`${featured ? 'bg-blue-button' : 'bg-gray-200'}`}
            // onChange={value => setFeatured(value)}
            checked={featured}
          />
        </Form.Item>

        {/* Available */}
        <Form.Item label='Available'>
          {(!initial || initial.available) && <Tag color='green'>Yes</Tag>}
          {initial && !initial.available && <Tag color='red'>No</Tag>}
        </Form.Item>

        {/* Image */}
        {/* Upload image here. Since it's an asynchronous behaviour,  we need to implement some state handling here */}
        <Form.Item name='image' label='Image'>
          <Upload
            listType='picture-card'
            className='avatar-uploader'
            showUploadList={false}
            onChange={handleUpload}
            beforeUpload={beforeUpload}
          >
            {imgUrl ? (
              <img src={imgUrl} alt='Product Thumbnail' />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FormProductModify
