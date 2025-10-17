import React, { useState } from 'react';
import "./withdrawal.css";
import api from "../../API/index";

const Withdrawal = () => {
  const [backup, setBackup] = useState(false);
  const [restore, setRestore] = useState(false);
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const canWithdraw = backup && restore;

  const handleBackupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackup(e.target.checked);
  };

  const handleRestoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestore(e.target.checked);
  };

  const handleOpenModal = () => {
    if (canWithdraw) {
      setShowModal(true);
    } else {
      alert("모든 동의 항목에 체크해주세요.");
    }
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    // 배경 클릭 시만 닫히게 (모달 내부 클릭 무시)
    if (
      (e.target as HTMLElement).classList.contains("withdrawal-modal-overlay")
    ) {
      setShowModal(false);
    }
  };

  const withDrawal = async () => {
    try {
      const response = await api.post(`/api/user/withdrawal`, { password });
      alert(response.data.message || "회원탈퇴가 완료되었습니다.");
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("회원탈퇴에 실패했습니다. 비밀번호를 다시 확인해주세요.");
    }
  };

  return (
    <div className="withdrawal-whole-container">
      <div className="withdrawal-header">
        <div className="withdrawal-header-title">회원탈퇴</div>
        <div className="withdrawal-header-question">정말 탈퇴하시겠습니까?</div>
      </div>

      <div className="withdrawal-content">
        <ul className="withdrawal-content-explain">
          <li>탈퇴 전 반드시 확인해주세요.</li>
          <li>회원탈퇴 즉시 개인정보를 포함한 모든 정보가 삭제됩니다.</li>
        </ul>
      </div>

      <div className="withdrawal-agree-set">
        <label className="checkbox-set">
          <input
            type="checkbox"
            className="agreebox"
            checked={backup}
            onChange={handleBackupChange}
          />
          <div className="withdrawal-content-checkbox-text">
            중요한 정보를 모두 백업하셨나요?
          </div>
        </label>

        <label className="checkbox-set">
          <input
            type="checkbox"
            className="agreebox"
            checked={restore}
            onChange={handleRestoreChange}
          />
          <div className="withdrawal-content-checkbox-text">
            계정이 삭제되면 모든 정보가 삭제되며 복구할 수 없습니다.
          </div>
        </label>
      </div>

      <button
        className="withdrawal-button"
        disabled={!canWithdraw}
        onClick={handleOpenModal}
      >
        회원탈퇴
      </button>

      {showModal && (
        <div className="withdrawal-modal-overlay" onClick={handleCloseModal}>
          <div className="withdrawal-modal">
            <h3>비밀번호 확인</h3>
            <p>탈퇴를 진행하려면 비밀번호를 입력해주세요.</p>
            <input
              type="password"
              className="withdrawal-password-input"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="withdrawal-modal-buttons">
              <button
                className="withdrawal-modal-cancel-button"
                onClick={() => setShowModal(false)}
              >
                취소
              </button>
              <button
                className="withdrawal-modal-confirm-button"
                onClick={withDrawal}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdrawal;
