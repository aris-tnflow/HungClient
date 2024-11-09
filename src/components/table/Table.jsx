import React, { useState, useCallback, useMemo } from "react";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch } from "react-redux";
import { toastError, toastSuccess } from "~/components/toast";
import SkeletonTable from "~/components/loading/SkeletonTable";
import { useBeforeUnload, useLocation } from "react-router-dom";

const Row = React.memo(({ ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props["data-row-key"] });
  const style = useMemo(
    () => ({
      ...props.style,
      transform: CSS.Translate.toString(transform),
      transition,
      cursor: "move",
      ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
    }),
    [props.style, transform, transition, isDragging]
  );

  return (
    <tr
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  );
});

const EditableCell = React.memo(
  ({
    editing,
    dataIndex,
    title,
    type,
    optionSelect,
    children,
    ...restProps
  }) => {
    const inputNode = useMemo(() => {
      switch (type) {
        case "number":
          return <InputNumber className="w-full" placeholder={title} />;
        case "price":
          return (
            <InputNumber
              className="w-full"
              min={0}
              step={50000}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
              placeholder={title}
            />
          );
        case "percent":
          return (
            <InputNumber
              className="w-full"
              min={0}
              max={100}
              placeholder={title}
            />
          );
        case "select-multi":
          return (
            <Select
              allowClear
              mode="multiple"
              placeholder={title}
              options={optionSelect}
            />
          );
        case "select":
          return <Select placeholder={title} options={optionSelect} />;
        case "tag":
          return <Select mode="tags" placeholder={title} />;
        default:
          return <Input placeholder={title} />;
      }
    }, [type, title, optionSelect]);

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item name={dataIndex} style={{ margin: 0 }}>
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  }
);

const EditableTable = ({
  Api,
  ApiSearch,
  search,
  ApiPut,
  total,
  dragMode = true,
  loading,
  data,
  columns,
  onSave,
  onDelete,
  button,
  colEdit = true,
  isScroll = true,
  scroll,
  width,
  isSearch = false,
  isPagination = true,
  current,
  setCurrent,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [pageSize, setPageSize] = useState(
    localStorage.getItem("pageSize") || 10
  );

  const isEditing = useCallback(
    (record) => record.key === editingKey,
    [editingKey]
  );

  const edit = useCallback(
    (record) => {
      form.setFieldsValue(record);
      setEditingKey(record.key);
    },
    [form]
  );

  const cancel = useCallback(() => setEditingKey(""), []);

  const save = useCallback(async () => {
    try {
      const row = await form.validateFields();
      onSave({ ...row, id: editingKey });
      setEditingKey("");
    } catch (errInfo) {
      toastError(
        errInfo,
        "Lưu thay đổi thất bại !",
        "Vui lòng kiểm tra lại thông tin !"
      );
    }
  }, [form, onSave, editingKey]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } })
  );

  const onDragEnd = useCallback(
    ({ active, over }) => {
      if (active.id !== over?.id) {
        const newDataSource = arrayMove(
          data,
          data.findIndex((i) => i.key === active.id),
          data.findIndex((i) => i.key === over?.id)
        );
        const maxOrder = Math.max(...data.map((item) => item.order));
        const updatedDataSource = newDataSource.map((item, index) => ({
          ...item,
          order: maxOrder - index,
        }));
        const filteredDataSource = updatedDataSource.map(({ _id, order }) => ({
          _id,
          order,
        }));
        dispatch(ApiPut(filteredDataSource));
        toastSuccess(
          "drag",
          "Thay đổi vị trí thành công !",
          "Dữ liệu đã được cập nhật !"
        );
      }
    },
    [data]
  );

  const mergedColumns = useMemo(
    () =>
      columns.map((col) => {
        if (!col.editable) return col;
        return {
          ...col,
          onCell: (record) => ({
            record,
            type: col.type || "text",
            optionSelect:
              col.type === "select" || col.type === "select-multi"
                ? col.optionSelect
                : undefined,
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
            required: col.required || true,
          }),
        };
      }),
    [columns, isEditing]
  );

  useBeforeUnload(
    useCallback(() => {
      localStorage.setItem(location?.pathname?.split("/")?.pop(), 1);
    }, [location])
  ),
    [];

  return (
    <Form form={form} component={false}>
      {loading ? (
        <SkeletonTable columns={columns} isLoading={loading} />
      ) : (
        <DndContext
          sensors={sensors}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={data?.map((i) => i.key)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              components={{
                body: {
                  cell: EditableCell,
                  row: dragMode ? Row : undefined,
                },
              }}
              bordered
              dataSource={data}
              columns={[
                ...mergedColumns,
                ...(data?.length >= 1 && colEdit !== false
                  ? [
                      {
                        title: "Sửa",
                        dataIndex: "operation",
                        width: width || "7%",
                        fixed: "right",
                        render: (_, record) => {
                          const editable = isEditing(record);
                          return editable ? (
                            <span
                              className="flex justify-center gap-3"
                              style={{ cursor: "pointer" }}
                            >
                              <Typography.Text type="danger" onClick={cancel}>
                                <FaTimes size={22} />
                              </Typography.Text>
                              <Popconfirm
                                placement="bottomRight"
                                title="Bạn có chắc muốn lưu thay đổi"
                                onConfirm={save}
                              >
                                <Typography.Text type="success">
                                  <FaSave size={22} />
                                </Typography.Text>
                              </Popconfirm>
                            </span>
                          ) : (
                            <div
                              className="flex justify-center items-center gap-3"
                              style={{ cursor: "pointer" }}
                            >
                              {button && typeof button === "function"
                                ? button(record)
                                : null}
                              <Tooltip title="Chỉnh thông tin">
                                <Typography.Link
                                  disabled={editingKey !== ""}
                                  onClick={() => edit(record)}
                                >
                                  <FaEdit size={22} />
                                </Typography.Link>
                              </Tooltip>
                              <Popconfirm
                                disabled={editingKey !== ""}
                                placement="bottomRight"
                                title="Bạn có chắc muốn xóa !"
                                onConfirm={() => onDelete(record._id)}
                              >
                                <Tooltip title="Xóa thông tin">
                                  <Typography.Text
                                    type="danger"
                                    disabled={editingKey !== ""}
                                  >
                                    <FaTrash size={22} />
                                  </Typography.Text>
                                </Tooltip>
                              </Popconfirm>
                            </div>
                          );
                        },
                      },
                    ]
                  : []),
              ]}
              rowClassName="editable-row"
              onChange={(pagination, filters, sorter, extra) => {
                const isSearchF = Object.values(filters).every(
                  (value) => value === null
                );
                const { current, pageSize } = pagination;
                if (!isSearchF) {
                  return;
                }

                if (isSearch) {
                  dispatch(
                    ApiSearch({ ...search, page: current, limit: pageSize })
                  );
                } else {
                  dispatch(Api({ page: current, limit: pageSize }));
                }

                setPageSize(pageSize);
                setCurrent(current);
                localStorage.setItem(
                  location?.pathname?.split("/")?.pop(),
                  current
                );
                localStorage.setItem("pageSize", pageSize);
              }}
              pagination={
                isPagination
                  ? {
                      showTotal: (total, range) =>
                        `Hiển thị ${range[0]}-${range[1]} trong ${total} mục`,
                      current,
                      pageSize: Number(pageSize),
                      total,
                      showSizeChanger: true,
                      pageSizeOptions: [10, 20, 50, 100],
                    }
                  : false
              }
              scroll={
                isScroll
                  ? scroll || { x: 1200, y: "calc(100vh - 255px)" }
                  : undefined
              }
              footer={() => <div className="h-5"></div>}
            />
          </SortableContext>
        </DndContext>
      )}
    </Form>
  );
};

export default EditableTable;
