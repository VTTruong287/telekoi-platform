import React from 'react'
import WebApp from '@twa-dev/sdk'
import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'
import './App.css'
import { apiService } from './api/api'
import { validate } from '@tma.js/init-data-node'

type UserInfo = {
  tgId?: number
  tgUserName?: string
  invitedBy?: string
}

function App() {
  const [count, setCount] = React.useState(0)
  const [userInfo, setUserInfo] = React.useState<UserInfo>({})
  const [allRefCode, setAllRefCode] = React.useState('')

  const [initDataQuery, setInitDataQuery] = React.useState('')

  const [validateErr, setValidateErr] = React.useState<any>(undefined)

  const counterHandler = () => {
    const randomValue = 1 + Math.floor(Math.random() * 10)
    setCount((count) => count + randomValue)
  }

  React.useEffect(() => {
    const initData = WebApp?.initDataUnsafe;
    const tgId = initData?.user?.id;
    const tgUserName = initData?.user?.username;
    const invitedBy = initData?.start_param;

    if (tgId) {
      setUserInfo({
        tgId,
        tgUserName,
        invitedBy
      })
    }
  }, [WebApp?.initDataUnsafe])

  const getAllRef = async () => {
    const rs = await apiService.reference?.getAllReference()
    console.log('rs: ', rs)

    !!rs && setAllRefCode(JSON.stringify(rs))
  }

  const saveRefCode = async () => {
    if (userInfo && userInfo.tgId && userInfo.invitedBy) {
      const rs = await apiService.reference?.saveRefCode(userInfo.tgId?.toString(), userInfo.invitedBy);
      if (rs) {
        WebApp.showPopup({
          title: 'Save Ref Code',
          message: 'SUCCESS'
        })
      } else {
        WebApp.showPopup({
          title: 'Save Ref Code',
          message: 'FAIL'
        })
      }
    } else {
      // Prompt error
      console.log('saveRefCode --- Wrong input data')
    }
  }

  const validateInitData = () => {
    /*
    Function will throw an error in one of these cases:
    - auth_date should present integer
    - auth_date is empty or not found
    - hash is empty or not found
    - Signature is invalid
    - Init data expired
    */
   try {
    const secretToken = import.meta.env.VITE_TELE_SECRET_TOKEN;
    const initData = WebApp?.initDataUnsafe
    const initDataQueryString =
      `query_id=${initData?.query_id}` +
      `&user=%7B%22id%22%3A${initData?.user?.id || ''}%2C%22first_name%22%3A%22${initData?.user?.first_name || ''}%22%2C%22last_name%22%3A%22${initData?.user?.last_name || ''}%22%2C%22username%22%3A%22${initData?.user?.username || ''}%22%2C%22language_code%22%3A%22${initData?.user?.language_code || ''}%22%2C%22is_premium%22%3A${initData?.user?.is_premium || ''}%7D` +
      `&auth_date=${initData.auth_date}` +
      `&hash=${initData?.hash}`;
    validate(initDataQueryString, secretToken);

    setInitDataQuery(initDataQueryString);

    return true;
   } catch (error) {
    // @ts-ignore
     console.log('ERR - validateInitData: ', error?.message)
     console.log('ERR - validateInitData 2: ', JSON.stringify(error))

     setValidateErr(error)
     return false;
   }
  }

  return (
    <>
      <h1>Telegram mini games v3</h1>
      <div className="card">
        <button onClick={getAllRef}>Call Get All Ref API</button>
        <br />
        <button onClick={saveRefCode}>Call Add Ref API</button>
        <br />
        <button onClick={validateInitData}>Validate Init Data</button>
        <br />
        <p>
          <label>Telegram ID: {userInfo.tgId || '...'}</label>
        </p>
        <p>
          <label>Telegram User Name: {userInfo.tgUserName || '...'}</label>
        </p>
        <p>
          <label>Telegram Invited ID: {userInfo.invitedBy || '...'}</label>
        </p>
        <p>
          <label>Init Data: {JSON.stringify(WebApp?.initDataUnsafe)}</label>
        </p>
        <p>
          <label>Init Data Query: {`${initDataQuery}`}</label>
        </p>
        <p>
          <label>ERR Validation - Init Data: {`${JSON.stringify(validateErr)} - ${validateErr?.message}`}</label>
        </p>
        <p>
          <label>All Ref Code: {allRefCode}</label>
        </p>
      </div>
      <div className="card">
        <button className='btn btn-primary' onClick={counterHandler}>
          Click to add random 1-10 
        </button>
        <br />
        <p>
          <label>Total is {count}</label>
        </p>
      </div>
      <div className="card-flex-center">
        <TonConnectButton />
      </div>
    </>
  )
}

export default App
