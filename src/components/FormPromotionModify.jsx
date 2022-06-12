import React, { useEffect, useState } from 'react'
import { Form, Input, Upload, Select, Switch, message, Modal, DatePicker, TimePicker } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { type } from '@testing-library/user-event/dist/type'
const { Option } = Select

const FormPromotionModify = ({
  isShowing,
  onCreate,
  onCancel,
  title,
  initial,
  fetchPromotion
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [imgUrl, setImgUrl] = useState(initial?.banner)
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
    console.log(values.banner)
    // try {
    //   const token = await currentUser.getIdToken()
    //   await appApi.post(
    //     routes.ADD_PROMOTION,
    //     routes.getAddPromotionBody(
    //       values.name,
    //       values.begin.toDate(),
    //       values.end.toDate(),
    //       values.value,
    //       values.banner
    //     ),
    //     routes.getAccessTokenHeader(token)
    //   )

    //   await fetchPromotion()
    //   console.log('Success')
    // } catch (err) {
    //   console.log(err)
    // }
  }

  const updateItem = async values => {
    try {
      const token = await currentUser.getIdToken()
      await appApi.put(
        routes.UPDATE_PROMOTION,
        routes.getUpdatePromotionBody(
          initial.id,
          values.name,
          values.begin,
          values.end,
          values.banner,
          values.value
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
      forceRender
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
          initialValue={initial?.promotionName}
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
          initialValue={initial?.value}
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
          initialValue={moment({hour:0,minute:0})}
          rules={[
            {
              type: 'object'
            }
          ]}
        >
            <DatePicker 
              showTime
              format={'DD/MM/YYYY HH:mm'} 
              />
        </Form.Item>
        {/* End */}
        <Form.Item
          name='end'
          label='End'
          initialValue={moment({hour:0,minute:0}).add(1,'days')}
          rules={[
            {
              type: 'object'
            }
          ]}
        >
            <DatePicker showTime format={'DD/MM/YYYY HH:mm'}/>
        </Form.Item>
        {/* Image */}
        {/* Upload image here. Since it's an asynchronous behaviour,  we need to implement some state handling here */}
        <Form.Item name='banner' label='Banner' initialValue={initial?.banner}>
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
