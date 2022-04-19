import React, { useMemo, useState, useContext, useEffect } from 'react';
import CustomTable from './Common/CustomTable';
import { TitleColumns } from './Common/Columns';
import MailContext from '../Context/mailContext';
import Header from './Header';
import RefreshContactList from './Common/RefreshContactList';
import Loader from './Common/Loader';
import * as qs from 'query-string';

const ContactList = (props) => {
  const mailContext = useContext(MailContext);
  const [selectedRow, setSelectedRow] = useState('');
  const [DirectPhoneNo, setDirectPhoneNo] = useState('');
  const [Tel, setTel] = useState('');

  const [dpError, setdpErro] = useState('');

  const [showdpError, setshowdpError] = useState(false);
  const [isChangeTel, setIsChangeTel] = useState(false);
  const [isChangeDirectPhone, setIsChangeDirectPhone] = useState(false);

  const [telError, settelError] = useState('');

  const [showtelError, setshowtelError] = useState(false);
  const {
    GetContactList,
    GetDecodePrsCode,
    createOrUpdateContact,
    createdorupdatedContact,
    contactlist,
    decodePrsCode,
    currentUser,
    isAdmin,
    error,
  } = mailContext;
  useEffect(() => {
    var pc = qs.parse(props.location.search);
    GetDecodePrsCode(pc.pc);
    GetContactList();
  }, []);

  const setSelectedRowData = (row) => {
    setSelectedRow(row.original);
    // console.log(row.original);
    if (row.original.DirectPhoneNo) {
      setDirectPhoneNo(row.original.DirectPhoneNo);
    }
    if (row.original.Tel) {
      setTel(row.original.Tel);
    }
  };

	  const kartableActionsAdmin = {
		Header: 'عملیات',
		columns: [
		  {
			Header: '.',
			Cell: ({ row }) => (
			  <div className='Operations'>
				<button
				  type='button'
				  className='editBtn'
				  data-toggle='modal'
				  data-target='.bd-example-modal-lg'
				  onClick={(e) => {
					setTel('');
					setDirectPhoneNo('');
					setSelectedRowData(row);
				  }}
				>
				  ویرایش
				</button>
			  </div>
			),
		  },
		],
	  };
  const kartableActions = {
    Header: '-',
    columns: [
      {
        Header: '.',
        Cell: ({ row }) => (
          <div className='Operations' style={{ height: '35px' }}>
            {' '}
          </div>
        ),
      },
    ],
  };
  const KartableColumns = useMemo(() => [kartableActions, TitleColumns], []);
  const KartableColumnsForAdmin = useMemo(
    () => [kartableActionsAdmin, TitleColumns],

    []
  );

  const onChanged = (e, Type, maxNum) => {
    switch (Type) {
      case 'Tel':
        // setShowError(false);
        if (e.target.value.length > maxNum)
          e.target.value = e.target.value.slice(0, maxNum);
        setIsChangeTel(true);
        setTel(e.target.value);
        break;
      case 'DirectPhoneNo':
        // setShowError(false);
        if (e.target.value.length > maxNum)
          e.target.value = e.target.value.slice(0, maxNum);
        setIsChangeDirectPhone(true);
        setDirectPhoneNo(e.target.value);
        break;
      default:
        break;
    }
  };

  const createorupdateContactToServer = async (frmData, Type) => {
    switch (Type) {
      case 'Admin':
        await createOrUpdateContact(frmData);

        break;
      case 'person':
        var pc = qs.parse(props.location.search);
        console.log(pc.pc);
        await createOrUpdateContact(frmData, pc.pc);
        // GetDecodePrsCode(pc.pc);
        break;

      default:
        break;
    }
  };

  const changeStateByRefreshChild = () => {
    setTel('');
    setDirectPhoneNo('');
    GetContactList();
    //GetContactByPrsNum(selectedRow.Prsnum);
    setSelectedRow('');
    setIsChangeDirectPhone(false);
    setIsChangeTel(false);
  };

  const validateAndSend = async (e, Type) => {
    e.preventDefault();
    switch (Type) {
      case 'person':
        let inputDataPerson = {
          DirectPhoneNo: isChangeDirectPhone
            ? DirectPhoneNo
            : currentUser.DirectPhoneNo,
          Tel: isChangeTel ? Tel : currentUser.Tel,
          // DirectPhoneNo: DirectPhoneNo,
          // Tel: Tel,
          Nam: currentUser.Nam,
          Prsnum: currentUser.Prsnum,
          NamKhanevadegi: currentUser.NamKhanevadegi,
          Moavenat: currentUser.Moavenat,
          Proj_Name: currentUser.Proj_Name,
          Sharh_Onvan: currentUser.Sharh_Onvan,
          NumBuild: currentUser.NumBuild,
        };

        createorupdateContactToServer(inputDataPerson, Type);
        setTel('');
        setDirectPhoneNo('');
        setIsChangeDirectPhone(false);
        setIsChangeTel(false);
        break;
      case 'Admin':
        let inputData = {
          DirectPhoneNo: isChangeDirectPhone
            ? DirectPhoneNo
            : selectedRow.DirectPhoneNo,
          Tel: isChangeTel ? Tel : selectedRow.Tel,
          Nam: selectedRow.Nam,
          Prsnum: selectedRow.Prsnum,
          NamKhanevadegi: selectedRow.NamKhanevadegi,
          Moavenat: selectedRow.Moavenat,
          Proj_Name: selectedRow.Proj_Name,
          Sharh_Onvan: selectedRow.Sharh_Onvan,
          NumBuild: selectedRow.NumBuild,
        };

        createorupdateContactToServer(inputData, Type);
        setTel('');
        setDirectPhoneNo('');
        setSelectedRow('');
        setIsChangeDirectPhone(false);
        setIsChangeTel(false);

        break;

      default:
        break;
    }
  };

  return (
    <div className='text-center'>
      <Header />

      <div
        className='modal fade bd-example-modal-lg'
        tabIndex='-1'
        role='dialog'
        aria-labelledby='myLargeModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLabel'>
                ویرایش
              </h5>
              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              <form>
                <div className='form-group'>
                  <label className='col-form-label '>
                    شماره پرسنلی:
                    <span className='h5 font-weight-bold '>
                      {selectedRow.Prsnum}
                    </span>
                  </label>
                  <label className='d-block'>
                    نام:
                    <span className='h5 font-weight-bold '>
                      {selectedRow.Nam}
                    </span>{' '}
                    &nbsp; &nbsp;نام خانوادگی:{' '}
                    <span className='h5 font-weight-bold'>
                      {selectedRow.NamKhanevadegi}
                    </span>
                  </label>

                  <label className='d-block'>
                    معاونت:
                    <span className='h5 font-weight-bold'>
                      {selectedRow.Moavenat}
                    </span>
                    <span>&nbsp; &nbsp;</span>
                    مدیریت:
                    <span className='h5 font-weight-bold'>
                      {selectedRow.Proj_Name}
                    </span>
                  </label>
                  <label className='col-form-label'>
                    عنوان:
                    <span className='h5 font-weight-bold'>
                      {selectedRow.Sharh_Onvan}
                    </span>
                  </label>

                  <label className='d-block '>
                    شماره ساختمان:
                    <span className='h5 font-weight-bold '>
                      {selectedRow.NumBuild}
                    </span>
                  </label>
                </div>
                <div className='form-group'>
                  <label className='col-form-label'>شماره تلفن مستقیم</label>
                  <input
                    type='text'
                    value={DirectPhoneNo ? DirectPhoneNo : ''}
                    onChange={(e) => {
                      onChanged(e, 'DirectPhoneNo', 300);
                    }}
                    className='text-center form-control'
                    id='recipient-name'
                  />
                  {showdpError && <label key='9'>*</label>}
                </div>
                <div className='form-group'>
                  <label htmlFor='message-text' className='col-form-label'>
                    تلفن داخلی
                  </label>
                  <input
                    type='text'
                    value={Tel ? Tel : ''}
                    onChange={(e) => {
                      onChanged(e, 'Tel', 300);
                    }}
                    className='text-center form-control'
                  />
                  {showtelError && <label key='9'>*</label>}
                </div>
              </form>
            </div>
            <div className='text-center'>
              <button
                type='button'
                className='btn btn-secondary'
                data-dismiss='modal'
                onClick={changeStateByRefreshChild}
              >
                بستن
              </button>
              <button
                type='button'
                className='btn btn-primary'
                data-dismiss='modal'
                onClick={(e) => validateAndSend(e, 'Admin')}
              >
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='d-inline-block mt-5 mr-5 text-center'>
        {createdorupdatedContact ? (
          <RefreshContactList
            changeStateByRefreshChild={changeStateByRefreshChild}
          />
        ) : null}
        {contactlist.length > 0 &&
        decodePrsCode !==
          'Invalid length htmlFor a Base-64 char array or string.' ? (
          <div className='rtl'>
            <ul
              className='nav nav-tabs nav-justified '
              style={{ direction: 'rtl' }}
              id='myTab'
              role='tablist'
            >
              <li className='nav-item'>
                <a
                  className='nav-link active'
                  id='home-tab'
                  data-toggle='tab'
                  href='#home'
                  role='tab'
                  aria-controls='home'
                  aria-selected='true'
                >
                  اطلاعات تماس
                </a>
              </li>
              <li className='nav-item'>
                <a
                  className='nav-link'
                  id='profile-tab'
                  data-toggle='tab'
                  href='#profile'
                  role='tab'
                  aria-controls='profile'
                  aria-selected='false'
                >
                  ویرایش اطلاعات تماس
                </a>
              </li>
            </ul>
            <div className='tab-content' id='myTabContent'>
              <div
                className='tab-pane fade show active'
                id='home'
                role='tabpanel'
                aria-labelledby='home-tab'
              >
                {isAdmin ? (
                  <CustomTable
                    columns={KartableColumnsForAdmin}
                    data={contactlist ? contactlist : []}
                  />
                ) : (
                  <CustomTable
                    columns={KartableColumns}
                    data={contactlist ? contactlist : []}
                  />
                )}
              </div>
              <div
                className='tab-pane fade w-100'
                id='profile'
                role='tabpanel'
                aria-labelledby='profile-tab'
              >
                <div className='mt-5 ' style={{ width: '100vw' }}>
                  <form>
                    <div className='form-row'>
                      <div className='form-group col-md-6'>
                        <label htmlFor='inputPassword4'>نام خانوادگی</label>
                        <input
                          className='form-control text-center'
                          disabled={true}
                          placeholder='نام خانوادگی'
                          defaultValue={currentUser.NamKhanevadegi}
                        />
                      </div>

                      <div className='form-group col-md-6'>
                        <label htmlFor='inputEmail4'>نام</label>
                        <input
                          className='form-control text-center'
                          disabled={true}
                          placeholder='نام'
                          defaultValue={currentUser.Nam}
                        />
                      </div>
                    </div>
                    <div className='form-row' style={{ direction: 'rtl' }}>
                      <div className='form-group col-md-4'>
                        <label htmlFor='inputEmail4'>شماره پرسنلی</label>
                        <input
                          className='form-control text-center'
                          disabled={true}
                          placeholder='شماره پرسنلی'
                          defaultValue={currentUser.Prsnum}
                        />
                      </div>
                      <div className='form-group col-md-4'>
                        <label htmlFor='inputPassword4'>عنوان</label>
                        <input
                          className='form-control text-center'
                          disabled={true}
                          placeholder='عنوان'
                          defaultValue={currentUser.Sharh_Onvan}
                        />
                      </div>

                      <div className='form-group col-md-4'>
                        <label htmlFor='inputEmail4'>ساختمان</label>
                        <input
                          className='form-control text-center'
                          disabled={true}
                          placeholder='ساختمان'
                          defaultValue={currentUser.NumBuild}
                        />
                      </div>
                    </div>
                    <div className='form-row'>
                      <div className='form-group col-md-6'>
                        <label htmlFor='inputEmail4'>واحد / پروژه</label>
                        <input
                          className='form-control text-center'
                          disabled={true}
                          placeholder='واحد / پروژه'
                          defaultValue={currentUser.Proj_Name}
                        />
                      </div>
                      <div className='form-group col-md-6'>
                        <label htmlFor='inputPassword4'>معاونت</label>
                        <input
                          className='form-control text-center'
                          disabled={true}
                          placeholder='معاونت'
                          defaultValue={currentUser.Moavenat}
                        />
                      </div>
                    </div>
                    <div className='form-row'>
                      <div className='form-group col-md-6'>
                        <label htmlFor='inputPassword4'>
                          شماره تلفن مستقیم
                        </label>
                        <input
                          className='form-control text-center'
                          placeholder='شماره تلفن مستقیم'
                          value={
                            DirectPhoneNo
                              ? DirectPhoneNo
                              : currentUser.DirectPhoneNo
                          }
                          onChange={(e) => {
                            onChanged(e, 'DirectPhoneNo', 300);
                          }}
                        />
                      </div>

                      <div className='form-group col-md-6'>
                        <label htmlFor='inputEmail4'>شماره تلفن داخلی</label>
                        <input
                          className='form-control text-center'
                          placeholder='شماره تلفن داخلی'
                          value={Tel ? Tel : currentUser.Tel}
                          onChange={(e) => {
                            onChanged(e, 'Tel', 300);
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type='button'
                      onClick={(e) => validateAndSend(e, 'person')}
                      className='btn btn-primary'
                    >
                      ذخیره و به روز رسانی
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default ContactList;
