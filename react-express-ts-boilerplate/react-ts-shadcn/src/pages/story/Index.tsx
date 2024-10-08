import { DataTable } from "@/components/commons/data-table/DataTable";
import { Drawer } from "antd";
import { useState, useCallback, useMemo } from "react";
import StoryForm from "./StoryForm";
import { Button } from "@/components/ui/button";

export default function StoryIndex() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formType, setFormType] = useState("create");
  const [payload, setPayload] = useState(null);
  const [refreshData, setRefreshData] = useState(false); // Yeni state eklendi

  console.log("Index Render");

  const config = useMemo(
    () => ({
      service: "stories",
      columns: [
        { label: "Title", key: "title" },
        { label: "Content", key: "content" },
      ],
      description: "Test Data Table",
      enableMultiRowSelection: false, // multiple selection
      buttons: {
        create: true,
        update: true,
        delete: true,
        export: true,
        import: true,
        getSelectedRows: false,
      },
    }),
    []
  );

  const config2 = useMemo(
    () => ({
      service: "stories",
      columns: [
        { label: "Title", key: "title" },
        { label: "Content", key: "content" },
      ],
      description: "Test Data Table",
      enableMultiRowSelection: true, // multiple selection
      buttons: {
        create: false,
        update: false,
        delete: false,
        export: false,
        import: false,
        getSelectedRows: true,
      },
    }),
    []
  );

  const createCallback = useCallback(() => {
    setDrawerOpen(true);
    setFormType("create");
  }, []);

  const updateCallback = useCallback((payload: any) => {
    console.log("update callback", payload);
    setPayload(payload);
    setDrawerOpen(true);
    setFormType("update");
  }, []);

  const handleDataRefresh = useCallback(() => {
    console.log("Data refresh triggered");
    setRefreshData((prev) => !prev); // refreshData state'ini tetikler
  }, []);

  const getSelectedRowsCallback = useCallback((payload: any) => {
    console.log("getSelectedRows callback", payload);
  }, []);

  return (
    <div className="rounded-md p-2">
      <DataTable
        config={config}
        createCallback={createCallback}
        updateCallback={updateCallback}
        refreshData={refreshData} // refreshData prop'u eklendi
      />

      <DataTable config={config2} getSelectedRowsCallback={getSelectedRowsCallback} />

      <Drawer
        title="Story"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        <StoryForm
          formType={formType}
          payload={payload}
          setDrawerOpen={setDrawerOpen}
          handleDataRefresh={handleDataRefresh}
        />
      </Drawer>
    </div>
  );
}
