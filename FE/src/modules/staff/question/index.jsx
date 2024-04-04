import useGetQuestion from "@modules/manager/questions/hooks/query/useGetQuestion";
import { Button, Card, Form, message } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import FormItem2 from "./FormItem2";
import CustomPageHeader from "@components/CustomPageHeader";
import useCreateQuestionSubmit from "../hooks/mutate/useCreateQuestionSubmit";
import { useNavigate } from "react-router";
import useGetQuestionToday from "../hooks/query/useGetQuestionToday";
import { array2Object } from "@helper/array2Obj";
import CustomModal from "@components/CustomModal";
import useGetQuestionForStaff from "../hooks/query/useGetQuestionForStaff";
import useQueryString from "@hooks/useQueryString";
import useQueryString2 from "@hooks/useQueryString2";

const StaffQuestionHomePage = () => {
  const { data: questions } = useGetQuestionForStaff();
  const [form] = Form.useForm();

  const { qsParsed } = useQueryString2();
  const isDev = !!qsParsed?.isTest;
  const { data: currentQues } = useGetQuestionToday();
  useEffect(() => {
    form.setFieldsValue(currentQues?.data);
  }, [currentQues, form]);

  const mappingQuestion = useMemo(() => {
    return array2Object(questions, "_id");
  }, [questions]);
  const { mutate: createQuestion, isLoading } = useCreateQuestionSubmit();

  const [incorrectQuestion, setIncorrectQuestion] = useState([]);
  const refIncorrect = useRef();
  const nav = useNavigate();
  const onFinish = (value) => {
    const incorrectArray = [];
    if (!isDev) {
      Object.entries(value)?.forEach(([key, value], index) => {
        const _value = Array.isArray(value) ? value : [value];
        const question = mappingQuestion?.[key];
        const option = question?.option;

        const answers = option?.filter((e) => !!e?.isAnswer);
        if (answers?.length > 0) {
          const correct = answers?.every((e) => {
            return _value?.includes(e?.value);
          });
          if (answers?.length !== _value?.length || !correct) {
            incorrectArray.push(question);
          }
        }
      });
      if (incorrectArray?.length > 0) {
        setIncorrectQuestion(incorrectArray);
        refIncorrect.current?.open();
        message.warning("Hãy trả lời đúng hết câu hỏi để tiếp tục!");
        return;
      }
    }

    createQuestion({
      data: value,
    });
  };
  return (
    <div>
      <CustomModal
        noButton
        ref={refIncorrect}
        title={"Các câu đã sai"}
        isRealModal
      >
        {() => {
          return (
            <ul>
              {incorrectQuestion?.map((e) => {
                return <li key={e?._id}>{e?.name}</li>;
              })}
            </ul>
          );
        }}
      </CustomModal>
      <CustomPageHeader title="Công việc đầu ca" />
      <div>
        <Form
          scrollToFirstError={{
            behavior: "smooth",
          }}
          disabled={isLoading || !!currentQues}
          form={form}
          name="basic"
          // initialValues={initData}
          onFinish={onFinish}
          onFinishFailed={(d) => {
            // console.log(d);
          }}
          // onFinish={initData ? onUpdate : onFinish}
          autoComplete="off"
          layout="vertical"
        >
          {questions?.map((e) => {
            return (
              <Card className="mb-2" key={e?._id}>
                <FormItem2 isShuffle question={e} />
              </Card>
            );
          })}
          <div className="flex justify-center mt-2">
            <Button loading={isLoading} htmlType="submit" type="primary">
              Hoàn tất
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default StaffQuestionHomePage;
