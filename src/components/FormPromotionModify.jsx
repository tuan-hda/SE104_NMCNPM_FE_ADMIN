import React, { useEffect, useState } from 'react'
import { Form, Input, Upload, Select, Switch, message, Modal, DatePicker, TimePicke0, Button } from 'antd'
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

  const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
  
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
  
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Modal
      visible={isShowing}
      title={title}
      okButtonProps={{
        className: 'bg-blue-button'
      }}
      okType='primary'
      forceRender
    >
    <Upload {...props}>
    <Button >Click to Upload</Button>
  </Upload>
    </Modal>
  )
}

export default FormPromotionModify
