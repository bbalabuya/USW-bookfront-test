import React, { useState } from 'react';
import "./withdrawal.css";
import axios from 'axios';

const API_URL = (import.meta as any).env.VITE_DOMAIN_URL;

const Withdrawal = () => {
    const [backup, setBackup] = useState<boolean>(false);
    const [restore, setRestore] = useState<boolean>(false);

    const handleBackupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBackup(e.target.checked);
    };

    const handleRestoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRestore(e.target.checked);
    };

    const canWithdraw = backup && restore; //버튼 활성화 조건

    const withDrawal = async() =>{
        try{
            const response = await axios.delete(`${API_URL}/api/me`);
            console.log(response.data.message);
        }catch(err){
            console.error(err);
        }
        
    }

    return (
        <div className="withdrawal-whole-container">
            <div className="withdrawal-header">
                <div className='withdrawal-header-title'>회원탈퇴</div>
                <div className="withdrawal-header-question">정말 탈퇴하시겠습니까?</div>
            </div>

            <div className='withdrawal-content'>
                <ul className="withdrawal-content-explain">
                    <li>탈퇴 전 반드시 확인해주세요.</li>
                    <li>회원탈퇴 즉시 개인정보를 포함한 모든 정보가 삭제됩니다.</li>
                </ul>
            </div>

            <div className="withdrawal-agree-set">
                <label className='checkbox-set'>
                    <input
                        type="checkbox"
                        className='agreebox'
                        checked={backup}
                        onChange={handleBackupChange}
                    />
                    <div className='withdrawal-content-checkbox-text'>
                        중요한 정보를 모두 백업하셨나요?
                    </div>
                </label>
                <label className='checkbox-set'>
                    <input
                        type="checkbox"
                        className='agreebox'
                        checked={restore}
                        onChange={handleRestoreChange}
                    />
                    <div className='withdrawal-content-checkbox-text'>
                        계정이 삭제되면 모든 정보가 삭제되며 복구할 수 없습니다.
                    </div>
                </label>
            </div>

            <button
                className='withdrawal-button'
                disabled={!canWithdraw} // 체크박스 둘 다 클릭해야 활성화
                onClick={withDrawal}
            >
                회원탈퇴
            </button>
        </div>
    );
};

export default Withdrawal;
