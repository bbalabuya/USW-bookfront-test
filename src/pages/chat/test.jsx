import React, { useState } from "react";

const ImageUploadPreview = () => {
  const [image, setImage] = useState(null);

  // 이미지 선택 시 실행
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // 파일 하나만 선택
    if (file) {
      setImage(URL.createObjectURL(file)); // 선택된 파일을 미리보기 URL로 변환
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      
      {image && (
        <div>
          <h3>미리보기</h3>
          <img 
            src={image} 
            alt="preview" 
            style={{ width: "300px", height: "auto", marginTop: "10px" }} 
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadPreview;
