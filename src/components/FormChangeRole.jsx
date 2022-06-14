import React, { useEffect, useState } from 'react'
import { Form, Modal, Select, message} from 'antd'
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
  initial,
  fetchStaff,
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
    //const token = await currentUser.getIdToken()
    // console.log(routes.getAccessTokenHeader(token))
    // console.log(routes.getChangeRoleConfig(
    //   token,
    //   initial.id,
    //   convertToRoleID(values.role)
    // ))
    try {
      const token = await currentUser.getIdToken()
      const result = await appApi.put(
        routes.CHANGE_ROLE,
        routes.getChangeRoleBody(initial.userID,convertToRoleID(values.role)),
        routes.getAccessTokenHeader(token)
      )
      console.log(result)
      await fetchStaff()
      message.success('Role changed successfully!'); 
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
        {/* Role */}
        <Form.Item
          name='role'
          label='Role'
          initialValue={initial ? initial.User.roleData.value : roles[0]}
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