import React, { useEffect, useState } from 'react'
import { Form, Modal, Select} from 'antd'
import { } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'

const { Option } = Select

const status = [
    'Working',
    'Retired'
  ]

const FormChangeStatus = ({
  isShowing,
  onCreate,
  onCancel,
  title,
  initial,
  fetchStaff
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { currentUser } = useSelector(state => state.user)

  const clearFields = () => {
    setLoading(false)
  }

  const convertToStaffStatus = (statusValue) => {
      switch (statusValue) {
        case 'Working':
            return 1;
        default:
            return 0;
      }
  }

  const changeStatus = async values => {
    // const token = await currentUser.getIdToken()  
    // console.log(routes.getStaffStatusConfig(token,initial?.id,convertToStaffStatus(values.status)))
    try {
      const token = await currentUser.getIdToken()
      await appApi.put(
        routes.UPDATE_STAFF_STATUS,
        routes.getStaffStatusConfig(token,initial?.id,convertToStaffStatus(values.status))
      )
      await fetchStaff()
      console.log('Success')
    } catch (err) {
      console.log(err)
    }
  }


  const handleCancel = () => {
    onCancel()
    clearFields()
    form.resetFields()
  }

  const onOk = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields()
        onCreate(values)
        console.log(values)
        changeStatus(values)
        clearFields()
      })
      .catch(info => {
        console.log('Validate failed: ' + info)
      })
  }

  useEffect(() => {
    form.resetFields()
  }, [initial, form])


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
      centered
      forceRender
    >
      <Form
        form={form}
        name='form in modal'
        labelAlign='left'
        labelCol={{ span: 6 }}  
      >
        {/* Category */}
        <Form.Item
          name='status'
          label='Status'
          initialValue={initial ? initial.staffstatusData.value : status[0]}
        >
          <Select>
            {status.map((c, i) => (
              <Option value={c} key={i}>
                {c}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FormChangeStatus
