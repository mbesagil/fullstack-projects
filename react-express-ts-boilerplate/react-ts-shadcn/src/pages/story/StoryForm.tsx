import { Button } from "@/components/ui/button";
import ApiService from "@/core/ApiService";
import React, { useEffect, useState } from "react";

// setCreateOpen fonksiyonuna tip belirt
interface CreateFormProps {
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDataRefresh: () => void;
  formType: string;
  payload: any;
}

function StoryForm({
  setDrawerOpen,
  handleDataRefresh,
  formType,
  payload,
}: CreateFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const service = "stories";

  const clearForm = () => {
    setTitle("");
    setContent("");
  };

  const onSubmit = (event: any) => {
    event.preventDefault();

    if (formType == "create") {
      ApiService.post(`${service}`, { title, content })
        .then((res) => {
          console.log("res :>> ", res);
          setDrawerOpen(false);
          clearForm();
          handleDataRefresh();
        })
        .catch((err) => {
          console.log("err :>> ", err);
        });
    } else if (formType == "update") {
      ApiService.put(`${service}/${payload._id}`, { title, content })
        .then((res) => {
          console.log("res :>> ", res);
          setDrawerOpen(false);
          clearForm();
          handleDataRefresh();
        })
        .catch((err) => {
          console.log("err :>> ", err);
        });
    }
  };

  useEffect(() => {
    console.log("form render oldu");
    if (formType == "update") {
      console.log("payload :>> ", payload);
      setTitle(payload.title);
      setContent(payload.content);
    }
  }, [formType, payload]);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="m-10 w-full max-w-sm">
        <h2 className="text-xl font-bold text-center mb-4">
          {formType == "create" ? "Create Story" : "Update Story"}
        </h2>
        <div className="flex justify-center mb-2"></div>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Title
            </label>
            <input
              id="title"
              type="text"
              className={`w-full px-3 py-2 border rounded-md bg-transparent`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Content
            </label>
            <input
              id="content"
              type="text"
              className={`w-full px-3 py-2 border rounded-md bg-transparent`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center mb-3">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default React.memo(StoryForm);
