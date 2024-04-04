import CustomDrawer from "@components/CustomDrawer";
import { Button, message } from "antd";
import React, { useCallback, useRef, useState } from "react";
import pptxgen from "pptxgenjs";
import { FileExcelOutlined, ExportOutlined } from "@ant-design/icons";

const linkStyle = {
  underline: true,
  color: { argb: "FF0000FF" },
};
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
const URL_PROXY = `https://proxy-b2.168-work.space/?url=`;

export const dataURLToBlob = function (dataURL) {
  let BASE64_MARKER = ";base64,";
  if (dataURL.indexOf(BASE64_MARKER) === -1) {
    let parts = dataURL.split(",");
    let contentType = parts[0].split(":")[1];
    let raw = parts[1];
    return new Blob([raw], { type: contentType });
  }

  let parts = dataURL.split(BASE64_MARKER);
  let contentType = parts[0].split(":")[1];
  let raw = window.atob(parts[1]);
  let rawLength = raw.length;

  let uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};
const convertImage2Jpg = async (image, quality = 0.95, toDataURL) => {
  return new Promise(function (resolved, rejected) {
    var i = new Image();
    i.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = i.width;
      canvas.height = i.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(i, 0, 0);
      var dataUrl = canvas.toDataURL("image/jpeg", quality);
      if (toDataURL) {
        resolved(toDataURL);
        return;
      }
      let resizedImage = dataURLToBlob(dataUrl);
      resizedImage.name = Math.random() + ".jpg";
      resizedImage.lastModifiedDate = new Date();

      // let resizedFile = new File([resizedImage], Math.random() + ".jpg", {
      //   type: "image/jpg",
      // });
      resolved(resizedImage);
    };
    i.setAttribute("crossorigin", "anonymous"); // works for me
    i.src = typeof image === "string" ? image : URL.createObjectURL(image);
  });
};
function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
const ExportPowerPoint = ({
  type = "report",
  columns,
  dataSource,
  headerRows = [1],
  dataFn,
}) => {
  //   const rows = [
  //     ["Sale Sup", "Ngocj Nhan", "Ca lamf viec", "Ca sang"],
  //     ["Sale Sup", "Ngocj Nhan", "Ca lamf viec", "Ca sang"],
  //     ["Sale Sup", "Ngocj Nhan", "Ca lamf viec", "Ca sang"],
  //     ["Sale Sup", "Ngocj Nhan", "Ca lamf viec", "Ca sang"],
  //   ];
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [first, setfirst] = useState(false);
  const exportToPptx = useCallback(async () => {
    setfirst(true);
    let x = 0;
    const dataLocal = dataFn?.() || dataSource;
    try {
      for (const [storeName, databyDate] of Object.entries(dataLocal)) {
        let pres = new pptxgen();
        refStore.current.innerText = "Exporting for Store : " + storeName;
        x++;
        let dateCount = 0;
        for (const [dayKey, dataShift] of Object.entries(databyDate)) {
          refDate.current.innerText = "Exporting for date : " + dayKey;
          for (const [shiftKey, rows] of Object.entries(dataShift)) {
            let slideByStoreByDate = pres.addSlide();
            let k = 0;
            const ps = rows?.reduce((all, cur) => {
              const key = cur?.user?.username?.includes("PB") ? "PB" : "PG";

              if (!!cur?.imageCheckin) {
                all["imageCheckin"] = all["imageCheckin"]
                  ? all["imageCheckin"]
                  : {};

                all["imageCheckin"][key] = all["imageCheckin"][key]
                  ? all["imageCheckin"][key]
                  : 0;
                all["imageCheckin"][key]++;
              }
              if (!!cur?.imageCheckOut) {
                all["imageCheckOut"] = all["imageCheckOut"]
                  ? all["imageCheckOut"]
                  : {};

                all["imageCheckOut"][key] = all["imageCheckOut"][key]
                  ? all["imageCheckOut"][key]
                  : 0;
                all["imageCheckOut"][key]++;
              }

              return all;
            }, {});

            slideByStoreByDate.addText(
              [
                {
                  text: `${x}. ${storeName} | ${dayKey}`,
                  options: {
                    fontSize: 24,
                    bold: true,
                    color: "#204e26",
                  },
                },
              ],
              {
                y: "3%",
                x: "2%",
              }
            );
            slideByStoreByDate.addText(
              [
                {
                  text: `- Checkin : ${ps?.imageCheckin?.PG || 0} PG + ${
                    ps?.imageCheckin?.PB || 0
                  } PB`,
                  options: {
                    fontSize: 10,
                    bold: true,
                    color: "#204e26",
                  },
                },
              ],
              {
                y: "3%",
                x: "70%",
              }
            );
            slideByStoreByDate.addText(
              [
                {
                  text: `- Checkout : ${ps?.imageCheckOut?.PG || 0} PG + ${
                    ps?.imageCheckOut?.PB || 0
                  } PB`,
                  options: {
                    fontSize: 10,
                    bold: true,
                    color: "#204e26",
                  },
                },
              ],
              {
                y: "6%",
                x: "70%",
              }
            );
            for (const check of ["imageCheckin", "imageCheckOut"]) {
              k++;
              // ca sáng, chiều
              slideByStoreByDate.addText(
                [
                  {
                    text:
                      shiftKey +
                      " " +
                      (check === "imageCheckin" ? "checkin" : "checkout"),
                    options: {
                      fontSize: 10,
                      color: "#204e26",
                      bold: true,
                    },
                  },
                ],
                {
                  y: k === 1 ? "10%" : "54%",
                  x: "2%",
                }
              );
              let i = 0;
              for (const data of rows) {
                const GAP = 20;
                ref.current.innerText =
                  "Fetching image from : " + data?.[check];
                const imgCheckin = data?.[check];

                if (imgCheckin) {
                  ref.current.innerText = "compress image : " + data?.[check];
                  const dataFile = await convertImage2Jpg(
                    URL_PROXY + imgCheckin,
                    0.8
                  );

                  const dataFile2Base64 = await blobToBase64(dataFile);
                  slideByStoreByDate.addImage({
                    data: dataFile2Base64,

                    y: k === 1 ? "12%" : "57%",
                    x: i * GAP + 2 + "%",
                    w: GAP - 2 + "%",
                    h: "32%",
                  });
                  slideByStoreByDate.addText(
                    [
                      {
                        text:
                          (data?.user?.username?.includes("PB") ? "PB" : "PG") +
                          " " +
                          (i + 1),
                        options: {
                          fontSize: 10,
                          bold: true,
                          color: "#204e26",
                        },
                      },
                    ],
                    {
                      y: k === 1 ? 12 + 32 + 1.5 + "%" : 57 + 32 + 1.5 + "%",
                      x: i * GAP + 2 + "%",
                    }
                  );
                  ref.current.innerText =
                    "added image for " + data?.imageCheckin;
                }
                i++;
              }
            }
          }
          dateCount++;
          // if (dateCount === 4) break;
        }
        try {
          await pres.writeFile({
            fileName: `${storeName}-checkin-report.pptx`,
          });
          message.success("Export thành công cho : " + storeName);
        } catch (error) {
          message.error("Có lỗi xảy ra khi xuất store " + storeName);
          message.error("Có lỗi xảy ra " + error?.message);
          refError.current.innerText =
            "Export store " + storeName + " đã bị lỗi : " + error?.message;
        } finally {
        }
        refStore.current.innerText = "---";
        ref.current.innerText = "---";
        refDate.current.innerText = "---";
        // break;
      }
    } catch (error) {
    } finally {
      setfirst(false);
    }
    return;
  }, [dataFn, dataSource]);
  const ref = useRef();
  const refStore = useRef();
  const refDate = useRef();
  const refError = useRef();
  return (
    <CustomDrawer
      width={1000}
      title={"Xuất ra Powerpoint"}
      footer={false}
      button={({ open }) => (
        <Button
          style={{
            background: "#D24726",
          }}
          icon={<FileExcelOutlined />}
          onClick={open}
          type="primary"
        >
          Xuất Powerpoint
        </Button>
      )}
    >
      {() => (
        <div>
          <div ref={refStore}>--</div>
          <div className="text-red-500" ref={refError}>
            --
          </div>
          <div ref={refDate}>--</div>

          <div ref={ref}>--</div>
          <Button
            loading={first}
            icon={<ExportOutlined />}
            onClick={exportToPptx}
            type="primary"
          >
            Xuất
          </Button>
        </div>
      )}
    </CustomDrawer>
  );
};

export default ExportPowerPoint;
