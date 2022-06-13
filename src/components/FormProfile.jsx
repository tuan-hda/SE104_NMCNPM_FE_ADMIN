import React, { useEffect, useState } from 'react'
import { Form, Modal, Typography, Avatar, Image, Input,Tag } from 'antd'
import { } from '@ant-design/icons'
import defaultAvatar from '../images/User-avatar.svg'

const FormProfile = ({
  isShowing,
  onCancel,
  title,
  initial
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const getAddress = () => {
    const detail = initial.Addresses.detail
    const ward  = initial.Addresses.ward.slice(initial.Addresses.ward.indexOf('_')+1)
    const district = initial.Addresses.district.slice(initial.Addresses.district.indexOf('_')+1)
    const province = initial.Addresses.province.slice(initial.Addresses.province.indexOf('_')+1)
    return detail+', '+ward+', '+district+', '+province
  }
  const getRole = () => {
    switch (initial?.roleValue) {
      case 'Customer':
        return <Tag color='green'>Customer</Tag> //#87d068
      case 'Staff':
        return <Tag color='yellow'>Staff</Tag>
      case 'Admin':
        return <Tag color='red'>Admin</Tag>
      default:
    }
  }

  return (
    <Modal
      visible={isShowing}
      title={title}
      onCancel={onCancel}
      onOk={onCancel}
      okButtonProps={{
        className: 'bg-blue-button'
      }}
      okType='primary'
      centered
      forceRender
    >
    <div className='flex justify-center mb-8'>
      <Avatar
        src={ initial?.avatar?
          <Image
            src={initial?.avatar}
          />
          : <Image
          src={defaultAvatar}
          />
        }
        style= {{
          width: 140,
          height: 140
        }}
      />
    </div>
    
      <Form
        form={form}
        name='form in modal'
        labelAlign='left'
        labelCol={{ span: 6 }}  
      >
        {/* Name */}
        <Form.Item
          label={ 
            <p style={{fontWeight: 'bold'}}>Name</p>
            }
        >
        <Typography.Text>{initial?.name}</Typography.Text>
        </Form.Item>
        {/* Role */}
        <Form.Item
          label={ 
            <p style={{fontWeight: 'bold'}}>Role</p>
            }
        >
        {getRole()}
        </Form.Item>
        {/* Email */}
        <Form.Item
          label={ 
            <p style={{fontWeight: 'bold'}}>Email</p>
            }
        >
        <Typography.Text>{initial?.email}</Typography.Text>
        </Form.Item>
        {/* Phone number */}
        <Form.Item
          label={ 
            <p style={{fontWeight: 'bold'}}>Phone number</p>
            }
        >
        <Typography.Text>{initial?.phoneNumber}</Typography.Text>
        </Form.Item>
        {/* Address */}
        <Form.Item
          label={ 
            <p style={{fontWeight: 'bold'}}>Address</p>
            }
        >
        <Typography.Text>{initial?.Addresses.detail?getAddress():''}</Typography.Text>
        </Form.Item>
        {/* Gender */}
        <Form.Item
          label={ 
            <p style={{fontWeight: 'bold'}}>Gender</p>
            }
        >
        <Typography.Text>{initial?.gender}</Typography.Text>
        </Form.Item>
        {/* Date of birth */}
        <Form.Item
          label={ 
            <p style={{fontWeight: 'bold'}}>Date of birth</p>
            }
        >
        <Typography.Text>{initial?.dob?.slice(0,initial?.dob?.indexOf('T'))}</Typography.Text>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FormProfile
