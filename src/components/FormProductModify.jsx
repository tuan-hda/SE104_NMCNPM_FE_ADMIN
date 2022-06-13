import React, { useEffect, useState } from 'react'
import { Form, Input, Upload, Select, Switch, message, Modal } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'
import { useSelector } from 'react-redux'
import { v4 } from 'uuid'
import { storage } from '../firebase'
import { useRef } from 'react'
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
  initial,
  fetchProduct
}) => {
  const [form] = Form.useForm()
  const featured = Form.useWatch('featured', form)
  const available = Form.useWatch('available', form)
  // const available = Form.useWatch('available', form)
  const [loading, setLoading] = useState(false)
  const [imgUrl, setImgUrl] = useState(initial?.itemImage)
  const { currentUser } = useSelector(state => state.user)
  const initialImage = useRef()

  const clearFields = () => {
    setImgUrl('')
    setLoading(false)
  }

  const handleCancel = () => {
    onCancel()
    clearFields()
    form.resetFields()
  }

  const addItem = async (values, url) => {
    try {
      const token = await currentUser.getIdToken()
      console.log(
        'Add item: ',
        routes.getAddItemBody(
          values.name,
          values.category,
          url ? url : values.image,
          parseInt(values.price),
          values.calories,
          values.featured,
          values.available
        )
      )
      await appApi.post(
        routes.ADD_ITEM,
        routes.getAddItemBody(
          values.name,
          values.category,
          url ? url : values.image,
          parseInt(values.price),
          values.calories,
          values.featured,
          values.available
        ),
        routes.getAccessTokenHeader(token)
      )

      // fetchProduct()
      console.log('Success')
    } catch (err) {
      console.log(err)
    }
  }

  const updateItem = async (values, url) => {
    try {
      const token = await currentUser.getIdToken()
      console.log(
        'Update item: ',
        routes.getUpdateItemBody(
          initial.id,
          values.name,
          values.category,
          url ? url : values.image,
          values.price,
          values.calories,
          values.featured,
          values.available
        )
      )
      await appApi.put(
        routes.UPDATE_ITEM,
        routes.getUpdateItemBody(
          initial.id,
          values.name,
          values.category,
          url ? url : values.image,
          values.price,
          values.calories,
          values.featured,
          values.available
        ),
        routes.getAccessTokenHeader(token)
      )

      fetchProduct()
      console.log('Success')
    } catch (err) {
      console.log(err)
    }
  }

  const handleResult = values => {
    if (!initial) {
      if (!values.image) addItem(values)
      else handleUploadImage(values, values.image, addItem)
    } else {
      // If image doesn't change, dont upload it to Firebase storage
      if (initialImage.current === imgUrl) updateItem(values)
      else handleUploadImage(values, values.image, updateItem)
    }
  }

  const onOk = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields()
        onCreate(values)
        handleResult(values)
        clearFields()
      })
      .catch(info => {
        console.log('Validate failed: ' + info)
      })
  }

  const handleUploadImage = (values, image, callback) => {
    // Generate a random id to make sure images' name are not duplicate
    const imageName = v4()
    // Get extension of image (jpg/png)
    const imageExt = image.file.name.split('.').pop()
    const name = imageName + '.' + imageExt
    const task = storage.ref(`products/${name}`).put(image.file.originFileObj)
    task.on(
      'state_changed',
      snapshot => {},
      error => {
        console.log(error)
      },
      () => {
        storage
          .ref('products')
          .child(name)
          .getDownloadURL()
          .then(url => {
            callback(values, url)
          })
      }
    )
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
    initialImage.current = initial?.itemImage
    setImgUrl(initial?.itemImage)
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

        {/* Calories */}
        <Form.Item
          name='calories'
          label='Calories'
          initialValue={initial?.calories || 0}
          rules={[
            {
              required: true,
              message: "You must enter product's calories!"
            },
            {
              pattern: /^[0-9]*$/,
              message: 'Calories must be an integer'
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
            checked={featured}
          />
        </Form.Item>

        {/* Available */}
        <Form.Item
          name='available'
          label='Available'
          initialValue={initial ? initial.available : true}
        >
          <Switch
            className={`${available ? 'bg-blue-button' : 'bg-gray-200'}`}
            checked={available}
          />
        </Form.Item>

        {/* Available 
        <Form.Item label='Available'>
          {(!initial || initial.available) && <Tag color='green'>Yes</Tag>}
          {initial && !initial.available && <Tag color='red'>No</Tag>}
        </Form.Item>
        */}

        {/* Image */}
        {/* Upload image here. Since it's an asynchronous behaviour,  we need to implement some state handling here */}
        <Form.Item name='image' label='Image' initialValue={initial?.itemImage}>
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
