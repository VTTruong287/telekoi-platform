import React from 'react'
import WebApp from '@twa-dev/sdk'
import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'
import './App.css'
import { apiService } from './api/api'

type UserInfo = {
  tgId?: number
  tgUserName?: string
  invitedBy?: string
}

function App() {
  const [count, setCount] = React.useState(0)
  const [userInfo, setUserInfo] = React.useState<UserInfo>({})

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
  }

  const saveRefCode = async () => {
    if (userInfo && userInfo.tgId && userInfo.invitedBy) {
      const rs = await apiService.reference?.saveRefCode(userInfo.tgId?.toString(), userInfo.invitedBy);
      console.log("rs: ", rs);
    } else {
      // Prompt error
      console.log('saveRefCode --- Wrong input data')
    }
  }

  return (
    <>
      <h1>Telegram mini games</h1>
      <div className="card">
        <button onClick={getAllRef}>Call Get All Ref API</button>
        <button onClick={saveRefCode}>Call Add Ref API</button>
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
      </div>
      <div className="card">
        <button onClick={counterHandler}>
          Click to add random 1-10 
        </button>
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
