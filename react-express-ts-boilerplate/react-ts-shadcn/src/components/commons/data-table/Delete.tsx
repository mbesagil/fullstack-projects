import ApiService from "@/core/ApiService";
import { Modal } from "antd";
import { useState } from "react";
import { Button } from "@/components/ui/button";
interface DeleteProps {
  config: {
    service: string;
  };
  rowSelection: any;
  getServiceData: () => void;
  setRowSelection: (payload: any) => any;
}

export default function Delete({
  rowSelection,
  config,
  getServiceData,
  setRowSelection,
}: DeleteProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const deleteClick = () => {
    showModal();
  };

  const handleDelete = () => {
    let rowSelectionArray = Object.keys(rowSelection);
    console.log("Delete Handle id", rowSelectionArray[0]);

    ApiService.delete(`${config.service}/${rowSelectionArray[0]}`)
      .then((res) => {
        console.log("res :>> ", res);
        getServiceData();
        setRowSelection([]);
      })
      .catch((err) => {
        console.log("err :>> ", err);
      })
      .finally(() => {
        handleCancel();
      });
  };

  return (
    <div>
      <Button onClick={deleteClick}>Delete</Button>
      <Modal
        title="Confirm Delete"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button className="text-red-500" key="delete" onClick={handleDelete}>
            Delete
          </Button>,
        ]}
      >
        <div className="flex justify-center items-center">
          <span className="font-bold">Are You Sure</span>
        </div>
      </Modal>
    </div>
  );
}
