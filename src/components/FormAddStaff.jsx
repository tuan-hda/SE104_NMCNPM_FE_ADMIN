import React, { useEffect} from 'react'
import { Form, Input, Modal, message, Select } from 'antd'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'
import { useSelector } from 'react-redux'
const { Option } = Select


const FormProductModify = ({
  isShowing,
  onCreate,
  onCancel,
  title,
  initial,
  fetchStaff,
  restaurants
}) => {
  const [form] = Form.useForm()
  const { currentUser } = useSelector(state => state.user)

  const handleCancel = () => {
    onCancel()
    form.resetFields()
  }

  const addresses = restaurants.map((c, i) => (
      c.resAddress
  ))
  console.log(restaurants)
  const getRestaurantID = address => {
    const result = restaurants.filter(element => element.resAddress === address)
    return result[0].id
  }

  const addStaff = async values => {
    try {
      const token = await currentUser.getIdToken()
      const result = await appApi.post(
        routes.ADD_STAFF,
        routes.getAddStaffBody(
            values.email,
            getRestaurantID(values.restaurant)
        ),
        routes.getAccessTokenHeader(token)
      )

      console.log(result)
      if (result.data.errCode===0) {
        await fetchStaff()
        message.success('New staff added!'); 
      }
      else {
        message.error(result.data.errMessage);
      }
      
    } catch (err) {
      console.log(err)
    }
  }

  const onOk = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields()
        onCreate(values)
        addStaff(values)
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
        {/* Email */}
        <Form.Item
          name='email'
          label='Email'
          rules={[
            {
                required: true,
                message: "You must enter user's email",
            },
            {
                type: 'email',
                message: "This is not a valid email!"
            }
          ]}
        >
          <Input />
        </Form.Item>

        {/* Restaurant ID */}
        <Form.Item
          name='restaurant'
          label='Restaurant'
          initialValue={addresses[0]}
        >
          <Select>
            {addresses.map((c, i) => (
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

export default FormProductModify
