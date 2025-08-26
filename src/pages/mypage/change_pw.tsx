import React, { useState } from "react";
import "./change_pw.css"
import axios from "axios";

const URL = (import.meta as any).env.VITE_DOMAIN_URL;

const Change_pw = () => {
    const [origin_password, setOrigin_password] = useState<string>("");
    const [new_password, setNew_password] = useState<string>("");
    const [confirm_password, setConfirm_password] = useState<string>("");

    const allFilled = origin_password && new_password && confirm_password; // 세 칸 다 입력됐는지 여부

    const patch_password = () => {
        if (!allFilled) return; // 혹시라도 빈 값이면 실행 안함
        if (new_password !== confirm_password) {
            alert("변경할 비밀번호가 일치하지 않습니다.");
            return;
        }

        axios.patch(`${URL}/me/password`, {
            currentPassword: origin_password,
            newPassword: new_password
        }, {
            withCredentials: true,
        })
        .then(() => {
            alert("비밀번호가 성공적으로 변경되었습니다.");
            setOrigin_password("");
            setNew_password("");
            setConfirm_password("");
        })
        .catch(() => {
            alert("비밀번호 변경에 실패했습니다.");
        });
    };

    return (
        <div className="change_pw-whole-container">
            <div className="change_pw-header">
                <span className="change_pw-title">비밀번호 변경</span>
                <span className="change_pw-explain">'비밀번호 변경 완료하기'를 누르셔야 비밀번호가 변경됩니다</span>
            </div>
            <div className="change_pw-content">
                <div className="change_pw-enter-set">
                    <div className="change_pw-enter-title">기존 비밀번호를 입력해주세요</div>
                    <input
                        type="password"
                        className="change_pw-enter"
                        placeholder="기존 비밀번호"
                        onChange={(e) => setOrigin_password(e.target.value)}
                        value={origin_password}
                    />
                </div>
                <div className="change_pw-enter-set">
                    <div className="change_pw-enter-title">변경할 비밀번호를 입력해주세요</div>
                    <input
                        type="password"
                        className="change_pw-enter"
                        placeholder="새 비밀번호"
                        onChange={(e) => setNew_password(e.target.value)}
                        value={new_password}
                    />
                </div>
                <div className="change_pw-enter-set">
                    <div className="change_pw-enter-title">확인을 위해 변경할 비밀번호를 한번 더 입력해주세요</div>
                    <input
                        type="password"
                        className="change_pw-enter"
                        placeholder="새 비밀번호 확인"
                        onChange={(e) => setConfirm_password(e.target.value)}
                        value={confirm_password}
                    />
                </div>
            </div>
            <button
                className={`change_pw-save ${allFilled ? "active" : ""}`}
                onClick={patch_password}
                disabled={!allFilled}
            >
                비밀번호 변경 완료하기
            </button>
        </div>
    );
};

export default Change_pw;
