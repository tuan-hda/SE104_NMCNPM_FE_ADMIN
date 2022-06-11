import React, { useEffect, useState } from 'react'
import { Form, Modal, Select} from 'antd'
import { } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'

const { Option } = Select

const roles = [
    'Admin',
    'Staff'
  ]

const FormChangeRole = ({
  isShowing,
  onCreate,
  onCancel,
  title,
  initial
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { currentUser } = useSelector(state => state.user)

  const clearFields = () => {
    setLoading(false)
  }

  const convertToRoleID = (roleValue) => {
      switch (roleValue) {
        case 'Admin':
            return '0';
        case 'Staff':
            return '1';
        default:
            return '2';
      } 
  }

  const changeRole = async values => {
    try {
      const token = await currentUser.getIdToken()
      await appApi.put(
        routes.CHANGE_ROLE,
        routes.getChangeRoleBody(
          convertToRoleID(values.role),
          initial.id
        ),
        routes.getAccessTokenHeader(token)
      )
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
        changeRole(values)
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
    >
      <Form
        form={form}
        name='form in modal'
        labelAlign='left'
        labelCol={{ span: 6 }}  
      >
        {/* Category */}
        <Form.Item
          name='role'
          label='Role'
          initialValue={initial ? initial.roleValue : roles[0]}
        >
          <Select>
            {roles.map((c, i) => (
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

export default FormChangeRole
