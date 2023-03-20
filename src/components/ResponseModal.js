import { Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useTranslation } from "react-i18next";

export default function ResponseModal(props) {
  const [t] = useTranslation('common')
  return (
    <Modal
      title={`${t('texts.detailed_response')}`}
      open={props.open}
      onCancel={() => props.hook(false)}
      footer={false}
      centered
      width='50vw'
    >
      <TextArea
        disabled
        value={props.content}
        style={{height: '35vh', cursor: 'text'}}
      />
    </Modal>
  );
}