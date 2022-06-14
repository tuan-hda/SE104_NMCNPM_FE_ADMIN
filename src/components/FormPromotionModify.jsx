import React, { useEffect, useState } from 'react'
import { Form, Input, Upload, Select, Switch, message, Modal, DatePicker, TimePicker } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { type } from '@testing-library/user-event/dist/type'
import { v4 } from 'uuid'
import { storage } from '../firebase'
import { useRef } from 'react'
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
      const result = await appApi.post(
        routes.ADD_PROMOTION,
        routes.getAddPromotionBody(
          values.name,
          values.begin.toDate(),
          values.end.toDate(),
          values.value,
           url ? url : values.banner,
        ),
        routes.getAccessTokenHeader(token)
      )
      console.log(result)
      if (result.data.errCode===0) {
        await fetchPromotion()
        message.success('New promotion added!'); 
      }
      else {
        message.error(result.data.errMessage);
      }
    } catch (err) {
      console.log(err)
    }
  }

  const updateItem = async (values, url) => {
    console.log(initial.id,
      values.name,
      values.begin.toDate(),
      values.end.toDate(),
      url ? url : values.banner,
      values.value)
    try {
      const token = await currentUser.getIdToken()
      const result = await appApi.put(
        routes.UPDATE_PROMOTION,
        routes.getUpdatePromotionBody(
          initial.id,
          values.name,
          values.begin.toDate(),
          values.end.toDate(),
          url ? url : values.banner,
          values.value
        ),
        routes.getAccessTokenHeader(token)
      )
      console.log(result)
      if (result.data.errCode===0) {
        await fetchPromotion()
        message.success('Promotion updated successfully!'); 
      }
      else {
        message.error(result.data.errMessage);
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleResult = values => {
    if (!initial) {
      if (!values.banner) addItem(values)
      else handleUploadImage(values, values.banner, addItem)
    } else {
      // If image doesn't change, dont upload it to Firebase storage
      if (initialImage.current === imgUrl) updateItem(values)
      else handleUploadImage(values, values.banner, updateItem)
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
    console.log(image.file.name)
    const imageExt = image.file.name.split('.').pop()
    const name = imageName + '.' + imageExt
    const task = storage.ref(`banners/${name}`).put(image.file.originFileObj)
    task.on(
      'state_changed',
      snapshot => {},
      error => {
        console.log(error)
      },
      () => {
        storage
          .ref('banners')
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
    initialImage.current = initial?.banner
    setImgUrl(initial?.banner)
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
          initialValue={isNaN(initial?.value*100) ? '' : initial?.value*100}
          rules={[
            {
              required: true,
              message: "You must enter promotion's value!"
            }
          ]}
        >
          <Input className='w-full' />
        </Form.Item>
        {/* Begin */}
        <Form.Item
          name='begin'
          label='Begin'
          initialValue={initial?.begin ? moment(initial.begin) : moment({hour:0,minute:0})}
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
          initialValue={initial?.end ? moment(initial.end) : moment({hour:0,minute:0}).add(1,'days')}
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