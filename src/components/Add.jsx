import { Controller, useFieldArray, useForm } from "react-hook-form"
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Add() {
  const [filesArray, setfilesArray] = useState([
    {
      fileName: '', typeName: '', file: ''
    }
  ])
  const { register, watch,reset, handleSubmit, setValue, control, formState: { errors } } = useForm({});

  const checkAddress = watch('sameAddress')
  useEffect(() => {
    if (checkAddress) {
      const resisdenceStreet1 = watch('street1')
      const resisdenceStreet2 = watch('street2')
      setValue('pstreet1', resisdenceStreet1)
      setValue('pstreet2', resisdenceStreet2)
    }
  }, [watch, checkAddress])

  const validateDateOfBirth = (value) => {
    const dob = new Date(value);
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 18);

    if (dob > minDate) {
      return 'You must be at least 18 years old';
    }

    return true;
  };

  const fileTypeArray = [
    { label: 'PNG', value: 'png' },
    { label: 'PDF', value: 'pdf' },
    { label: 'JPG', value: 'jpg' },
    { label: 'SVG', value: 'svg' }
  ]

  const getData = (value, i, key) => {
    const newArray = filesArray.map((elm, index) =>
      index == i ? Object.assign(elm, { [key]: value }) : elm
    )
    setfilesArray(newArray)
  }

  const removeData = (index) => {
    delete filesArray[index]

    var newArray = []
    filesArray?.map((item) => {
      newArray.push(item)
    })
    setfilesArray(newArray)
  }

  const handleUpload = (e, index, type, key) => {

    const file = e.target.files[0]
    if (file) {
      const splitData = file.name.split('.')
      const fileType = splitData[1]
      if (type == fileType) {
        const formData = new FormData();
        formData.append('files', file);

        const newArray = filesArray.map((elm, i) =>
          index == i ? Object.assign(elm, { [key]: file }) : elm
        )
        console.log("newArray",newArray)
        setfilesArray(newArray)
      } else {
        toast.error('File not match with the given type', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setValue(`document${index}.file`,'')
      }
    }
  }
  const onSubmit = async (data) => {
    console.log(data)
    console.log(filesArray)
    const payload = {
      document: filesArray,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      dob: data.dob,
      residentalAddress: {
        street1: data.street1,
        street2: data.street2
      },
      permanentAddress: {
        pstreet1: data.pstreet1,
        pstreet2: data.pstreet2
      }
    }
    if (filesArray.length > 1) {
      const todo = await fetch('http://localhost:3001/createUser', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'content-type': 'application/json'
        }
      })
      toast.success('Successfully saved', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      reset()
    } else {
      toast.error('Minimum 2 files are required to upload', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

  }


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="container">
        <div className="first-last">
          <div style={{ marginRight: '60px' }}>
            <label style={{ display: 'block' }}>First Name</label>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                {...register("firstName", { required: true, maxLength: 20 })}
                style={{ height: "30px", width: '300px', marginBottom: '5px' }}
              />
              {errors.firstName && errors.firstName.type === "required" && (
                <span style={{ color: 'red' }}>This is required</span>
              )}
            </div>
          </div>

          <div>
            <label style={{ display: 'block' }}>Last Name</label>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input {...register("lastName", { required: true, maxLength: 20 })}
                style={{ height: "30px", width: '300px' }} />
              {errors.firstName && errors.firstName.type === "required" && (
                <span style={{ color: 'red' }}>This is required</span>
              )}
            </div>
          </div>
        </div>
        <div className="email-dob">
          <div>
            <label style={{ display: 'block' }}>E-mail</label>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input {...register("email", { required: true, pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                style={{ height: "30px", width: '300px', marginRight: '60px' }}
              />
              {errors.email && errors.email.type === "required" && (
                <span style={{ color: 'red' }}>This is required</span>
              )}
            </div>
          </div>
          <div>
            <label style={{ display: 'block' }}>Date of birth</label>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                type="date"
                {...register("dob", {
                  required: 'Date of Birth is required',
                  validate: validateDateOfBirth,
                })}
                style={{ height: "30px", width: '300px', marginRight: '60px' }}
              />
              {errors.dob && <span style={{ color: 'red' }}>{errors.dob.message}</span>}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'block', fontWeight: 700 }}>Residental Address</label>
        </div>
        <div className="residental-address">
          <div>
            <label style={{ display: 'block' }}>Street 1</label>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input {...register("street1", { required: true, maxLength: 20 })}
                style={{ height: "30px", width: '300px', marginRight: '60px' }}
              />
              {errors.street1 && errors.street1.type === "required" && (
                <span style={{ color: 'red' }}>This is required</span>
              )}
            </div>
          </div>
          <div>
            <label style={{ display: 'block' }}>Street 2</label>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input {...register("street2", { required: true, maxLength: 20 })}
                style={{ height: "30px", width: '300px', marginRight: '60px' }}
              />
              {errors.street2 && errors.street2.type === "required" && (
                <span style={{ color: 'red' }}>This is required</span>
              )}
            </div>
          </div>
        </div>
        <div>
          <div style={{ marginTop: '20px', display: 'flex' }}>
            <div>
              <input {...register("sameAddress", { required: true, maxLength: 20 })}
                type="checkbox"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 700 }}>Same as Residental Address</label>
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', fontWeight: 700 }}>Parmanent Address</label>
          </div>
        </div>
        <div className="permanent-address">
          <div>
            <label style={{ display: 'block' }}>Street 1</label>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input {...register("pstreet1", {required: !checkAddress, maxLength: 20 })}
                style={{ height: "30px", width: '300px', marginRight: '60px' }}
              />
              {errors.pstreet1 && errors.pstreet1.type === "required" && (
                <span style={{ color: 'red' }}>This is required</span>
              )}
            </div>
          </div>
          <div>
            <label style={{ display: 'block' }}>Street 2</label>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <input {...register("pstreet2", { required: !checkAddress, maxLength: 20 })}
                style={{ height: "30px", width: '300px', marginRight: '60px' }}
              />  {errors.pstreet2 && errors.pstreet2.type === "required" && (
                <span style={{ color: 'red' }}>This is required</span>
              )}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'block', fontWeight: 700 }}>Upload Documents</label>
        </div>
        {filesArray.map((field, index) => (
          <div className="upload-doc" id={index} key={index}>
            <div>
              <label style={{ display: 'block' }}>File Name</label>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <input {...register(`document${index}.fileName`, { required: true, maxLength: 20 })}
                  style={{ height: "30px", width: '150px', marginRight: '60px' }}
                  value={field?.fileName}
                  onChange={(e) => getData(e.target.value, index, 'fileName')}
                />
                {errors[`document${index}.fileName`] && errors[`document${index}.fileName`].type === "required" && (
                  <span style={{ color: 'red' }}>This is required</span>
                )}
              </div>
            </div>
            <div>
              <label style={{ display: 'block' }}>Type of file</label>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <select {...register(`document${index}.typeName`)}
                  style={{ height: "35px", width: '180px', marginRight: '60px' }}
                  onChange={(e) => getData(e.target.value, index, 'typeName')}
                  value={field?.typeName}
                >
                  <option >
                    Select type
                  </option>
                  {fileTypeArray.map((field, index) => (
                    <option key={field.id} value={field.value} >
                      {field.label}
                    </option>
                  ))}
                </select>
                {errors[`document${index}.typeName`] && errors[`document${index}.typeName`].type === "required" && (
                  <span style={{ color: 'red' }}>This is required</span>
                )}
              </div>
            </div>
            <div>
              <label style={{ display: 'block' }}>Upload Document</label>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <input {...register(`document${index}.file`, { required: true, maxLength: 20 })}
                  style={{ height: "30px", width: '150px', marginRight: '60px' }}
                  type="file"
                  onChange={(e) => {
                    handleUpload(e, index, watch(`document${index}.typeName`), 'file')
                  }}
                />
                {errors[`document${index}.file`] && errors[`document${index}.file`].type === "required" && (
                  <span style={{ color: 'red' }}>This is required</span>
                )}
              </div>
            </div>
            {index == 0 ?
              <button onClick={() =>
                // append({
                //   fileName: '', typeName: '', file: ''
                // })
                setfilesArray([...filesArray, {
                  fileName: '', typeName: '', file: ''
                }])
              }>
                <AddBoxIcon />
              </button>
              :
              <button onClick={() => removeData(index)}>
                Delete
              </button>
            }
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }} className="submit">
        <button type="submit">Submit</button>
      </div>
      <ToastContainer />
    </form>
  )
}