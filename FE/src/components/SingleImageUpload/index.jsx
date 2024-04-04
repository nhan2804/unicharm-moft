import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import PlusOutlined from "@ant-design/icons/PlusOutlined";

import { BASE_URL, BASE_URL_UPLOAD } from "@config/axios";
// import convertImage2Jpg, { convertImage2JpgV2 } from "@helper/image2jpg";
import { useAppSelector } from "@hooks/reduxHook";
import Form from "antd/es/form";
import message from "antd/es/message";
import Upload from "antd/es/upload";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useParams } from "react-router";
import Compress from "compress.js";
import { Image as ImageAntd } from "antd";
import convertImage2JpgV2 from "@helper/convert2Jpg";
function drawTextOnImage(imageFile, textLines) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const image = new Image();

    const reader = new FileReader();

    reader.onload = function (event) {
      image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        context.font = "40px Arial";
        context.fillStyle = "red";

        const lineHeight = 50;
        const startY = 50;
        textLines.forEach((line, index) => {
          const y = startY + index * lineHeight;
          context.fillText(line, 10, y);
        });

        canvas.toBlob((blob) => {
          let file = new File([blob], "fileName.jpg", { type: "image/jpeg" });
          resolve(file);
        }, "image/jpeg");
      };

      // Set the image source as the loaded file
      image.src = event.target.result;
    };

    // Read the image file as a data URL
    reader.readAsDataURL(imageFile);
  });
}
const SingleImageUpload = (
  {
    label,

    maxWidth,
    maxHeight,
    resize = true,
    preview = false,
    name = "image",
    nameUpload = "file",
    projectId: projectIdProp,
    textDraw,
    rules,
    ...rest
  },
  ref
) => {
  const { projectId = projectIdProp } = useParams();
  const token = useAppSelector((state) => state.auth?.token);

  const [loading, setLoading] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      loadingUpload: loading,
    }),
    [loading]
  );

  const [urlImage, setImageUrl] = useState("");
  const getLink = (event) => {
    return event?.fileList[0]?.response?.newFile?.urlPublic;
  };
  async function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      return false;
    }
    const isLt32M = file.size / 1024 / 1024 < 32;
    if (!isLt32M) {
      message.error("Image must smaller than 32MB!");
      return false;
    }

    if (!resize) return file;
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      // useWebWorker: true,
      fileType: "image/jpg",
    };

    // const compressedFile = await new Promise((resolve) => {
    //   new Compressor(file, {
    //     quality: 0.6,
    //     convertTypes: ["image/png"],
    //     convertSize: 2000000,
    //     success: resolve,
    //   });
    // });
    // const compressedFile = await compressAccurately(file, {
    //   size: 100,
    //   type: "image/jpeg",
    // });
    // console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
    // alert("hehe");
    if (textDraw) {
      const fileDrawed = await drawTextOnImage(file, textDraw);
      return await convertImage2JpgV2(fileDrawed);
    }
    return await convertImage2JpgV2(file);
  }
  const uploadButton = (
    <div
      aria-hidden
      onClick={(e) => {
        if (preview) {
          e.stopPropagation();
        }
      }}
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div disabled={preview} style={{ marginTop: 8 }}>
        Tải lên
      </div>
    </div>
  );
  const handleChange = async (info) => {
    if (info.file.status === "uploading") {
      setImageUrl("");
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setImageUrl(info?.file?.response?.newFile?.urlPublic);

      setLoading(false);
      message.success(`${info.file.name} Tải lên thành công`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} Tải lên thất bại`);
      setLoading(false);
    }
  };
  const imgURL = urlImage ? new URL(urlImage)?.pathname : "";
  const imgArr = imgURL?.split("new-app-heiniken/");

  const oldMedia = imgArr?.[imgArr?.length - 1];

  return (
    <Form.Item
      rules={rules || []}
      getValueFromEvent={getLink}
      {...{ name, label }}
      getValueProps={(value) => setImageUrl(value)}
    >
      <Upload
        {...rest}
        method="POST"
        maxCount={1}
        value="image"
        accept="image/*"
        // action={`https://api.imgbb.com/1/upload?expiration=600&key=93804877e22f283eb8a2e639dcd8ec54`}
        action={`${BASE_URL}v1/api/upload/s3`}
        data={{
          projectId: projectId,
          oldUrl: oldMedia || "",
        }}
        // action={`http://localhost:6001/api/upload`}
        name={nameUpload}
        headers={{ Authorization: `Bearer ${token}` }}
        listType="picture-card"
        className="avatar-uploader overflow-hidden"
        showUploadList={false}
        beforeUpload={beforeUpload}
        openFileDialogOnClick={!preview}
        onChange={handleChange}
      >
        {urlImage ? (
          // <img src={urlImage} alt="avatar" style={{ width: "100%" }} />
          <ImageAntd
            className="overflow-hidden"
            onClick={(e) => {
              if (preview) {
                e.stopPropagation();
              }
            }}
            src={urlImage}
            preview={preview}
          />
        ) : preview ? (
          "No data"
        ) : (
          uploadButton
        )}
      </Upload>
    </Form.Item>
  );
};

export default forwardRef(SingleImageUpload);
