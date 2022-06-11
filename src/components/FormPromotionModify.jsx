import React, { useEffect, useState } from 'react'
import { Form, Input, Upload, Select, Switch, message, Modal, DatePicker, TimePicker } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'
import { useSelector } from 'react-redux'
import moment from 'moment'
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

const FormPromotionModify = ({
  isShowing,
  onCreate,
  onCancel,
  title,
  initial,
  fetchPromotion
}) => {
  const [form] = Form.useForm()
  const featured = Form.useWatch('featured', form)
  const available = Form.useWatch('available', form)
  // const available = Form.useWatch('available', form)
  const [loading, setLoading] = useState(false)
  const [imgUrl, setImgUrl] = useState(initial?.itemImage)
  const { currentUser } = useSelector(state => state.user)

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
        routes.ADD_PROMOTION,
        routes.getAddPromotionBody(
          values.name,
          values.begin,
          values.end,
          values.value,
          values.banner
        ),
        routes.getAccessTokenHeader(token)
      )

      await fetchPromotion()
      console.log('Success')
    } catch (err) {
      console.log(err)
    }
  }

  const updateItem = async values => {
    try {
      const token = await currentUser.getIdToken()
      console.log(
        'Update item: ',
        routes.getUpdateItemBody(
          initial.id,
          values.name,
          values.category,
          values.image,
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
          values.image,
          values.price,
          values.calories,
          values.featured,
          values.available
        ),
        routes.getAccessTokenHeader(token)
      )

      await fetchPromotion()
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
    setImgUrl(initial?.itemImage)
  }, [initial, form])

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8
        }}
      >~
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
              message: "You must enter promotion's name"
            }
          ]}
        >
          <Input />
        </Form.Item>

        {/* Value */}
        <Form.Item
          name='value'
          label='Value (%)'
          initialValue={initial?.value.substring(2)}
          rules={[
            {
              required: true,
              message: "You must enter promotion's value!"
            },
            {
              pattern: /[0-1]/,
              message: 'Value must be a number from 0-100'
            }
          ]}
        >
          <Input className='w-full' />
        </Form.Item>
        {/* Begin */}
        <Form.Item
          name='begin'
          label='Begin'
          initialValue={initial?.begin}
        >
            <DatePicker showTime format={'DD/MM/YYYY HH:mm'} defaultValue={moment({hour:0,minute:0})}/>
        </Form.Item>
        {/* End */}
        <Form.Item
          name='end'
          label='End'
          initialValue={initial?.end}
        >
            <DatePicker showTime format={'DD/MM/YYYY HH:mm'} defaultValue={moment({hour:0,minute:0}).add(1,'days')}/>
        </Form.Item>
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
              <img src={imgUrl} alt='Promotion' />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FormPromotionModify
