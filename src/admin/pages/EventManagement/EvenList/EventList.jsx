import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Form,
  Input,
  DatePicker,
  Select,
  Modal,
  message,
  Space,
  Card,
  Upload,
  Divider,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  fetchPromotions,
  updateEvent,
  addEvent,
  deleteEvent,
} from "../../../../services/service/servicePromotion";
import "./EventList.scss";
import { toast } from "react-toastify";
import { required } from "react-admin";

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const EventList = () => {
  const [form] = Form.useForm();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  // Lấy danh sách sự kiện từ Firebase
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const data = await fetchPromotions();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        message.error("Lỗi khi tải danh sách sự kiện");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);
  // Xử lý filter
  const handleFilter = (values) => {
    let filtered = [...events];

    if (values.search) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(values.search.toLowerCase()) ||
          event.description.toLowerCase().includes(values.search.toLowerCase())
      );
    }

    if (values.status) {
      const now = moment();
      filtered = filtered.filter((event) => {
        const start = moment(event.startDate);
        const end = moment(event.endDate);

        if (values.status === "active") {
          return now.isBetween(start, end);
        } else if (values.status === "upcoming") {
          return now.isBefore(start);
        } else if (values.status === "expired") {
          return now.isAfter(end);
        }
        return true;
      });
    }

    if (values.dateRange) {
      const [start, end] = values.dateRange;
      filtered = filtered.filter((event) => {
        const eventStart = moment(event.startDate);
        const eventEnd = moment(event.endDate);
        return (
          eventStart.isBetween(start, end, null, "[]") ||
          eventEnd.isBetween(start, end, null, "[]") ||
          (eventStart.isBefore(start) && eventEnd.isAfter(end))
        );
      });
    }

    setFilteredEvents(filtered);
  };

  // Xử lý tạo mới/chỉnh sửa sự kiện
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Tạo eventData, loại bỏ dateRange và chỉ giữ startDate, endDate
      const { dateRange, ...restValues } = values; // Loại bỏ dateRange
      const eventData = {
        ...restValues, // Các giá trị còn lại từ form
        startDate: dateRange[0].format("YYYY-MM-DD"),
        endDate: dateRange[1].format("YYYY-MM-DD"),
        slug:
          values.slug ||
          values.title
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, ""),
        views: isEditMode ? currentEvent.views : 0,
        likes: isEditMode ? currentEvent.likes : 0,
      };

      if (isEditMode) {
        await updateEvent(currentEvent.id, eventData); // Gọi hàm chỉnh sửa
        toast.success("Cập nhật sự kiện thành công");
      } else {
        await addEvent(eventData);
        toast.success("Tạo sự kiện mới thành công");
      }
      setVisible(false);
      form.resetFields();
      setFileList([]); // Reset fileList sau khi submit
      const updatedEvents = await fetchPromotions();
      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents);
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi lưu sự kiện");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa sự kiện
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa sự kiện",
      content: "Bạn có chắc chắn muốn xóa sự kiện này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setLoading(true);
          await deleteEvent(id);
          toast.success("Xóa sự kiện thành công");
          const updatedEvents = await fetchPromotions();
        } catch (error) {
          toast.error("Lỗi khi xóa sự kiện");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Mở modal chỉnh sửa
  const handleEdit = (event) => {
    setCurrentEvent(event);
    setIsEditMode(true);
    setVisible(true);

    form.setFieldsValue({
      ...event,
      dateRange: [moment(event.startDate), moment(event.endDate)],
    });

    if (event.thumbnail) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: event.thumbnail,
        },
      ]);
    }
  };

  // Mở modal tạo mới
  const handleCreate = () => {
    setCurrentEvent(null);
    setIsEditMode(false);
    setVisible(true);
    form.resetFields();
    setFileList([]);
  };

  // Columns cho bảng
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (text) => (
        <img
          src={text}
          alt="thumbnail"
          style={{ width: 40, height: 60, objectFit: "contain", borderRadius: 10 }}
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Lượt xem",
      dataIndex: "views",
      key: "views",
      sorter: (a, b) => moment(a.views).unix() - moment(b.views).unix(),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => moment(text).format("DD/MM/YYYY"),
      sorter: (a, b) => moment(a.endDate).unix() - moment(b.endDate).unix(),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const now = moment();
        const start = moment(record.startDate);
        const end = moment(record.endDate);

        if (now.isBefore(start)) {
          return <span style={{ color: "blue" }}>Sắp diễn ra</span>;
        } else if (now.isAfter(end)) {
          return <span style={{ color: "red" }}>Đã kết thúc</span>;
        } else {
          return <span style={{ color: "green" }}>Đang diễn ra</span>;
        }
      },
      filters: [
        { text: "Đang diễn ra", value: "active" },
        { text: "Sắp diễn ra", value: "upcoming" },
        { text: "Đã kết thúc", value: "expired" },
      ],
      onFilter: (value, record) => {
        const now = moment();
        const start = moment(record.startDate);
        const end = moment(record.endDate);

        if (value === "active") return now.isBetween(start, end);
        if (value === "upcoming") return now.isBefore(start);
        if (value === "expired") return now.isAfter(end);
        return true;
      },
    },
    {
      title: "Ưu tiên",
      dataIndex: "priority",
      key: "priority",
      sorter: (a, b) => a.priority - b.priority,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            title={record.is_protected ? "Không thể xóa dữ liệu mẫu" : "Xóa sự kiện"}
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            // disabled={record.is_protected} // Vô hiệu hóa nút nếu is_protected là true
          ></Button>
          <Button
            title={record.is_protected ? "Không thể xóa dữ liệu mẫu" : "Xóa sự kiện"}
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            disabled={record.is_protected} // Vô hiệu hóa nút nếu is_protected là true
          ></Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="event-list-container" style={{ padding: 10 }}>
      <Card
        title="Quản lý Sự kiện Khuyến mãi"
        extra={
          <Button type="primary" onClick={handleCreate}>
            Tạo sự kiện mới
          </Button>
        }>
        <Form layout="inline" onFinish={handleFilter} style={{ marginBottom: 16 }}>
          <Form.Item name="search">
            <Input placeholder="Tìm kiếm..." />
          </Form.Item>

          <Form.Item name="dateRange">
            <RangePicker format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lọc
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              onClick={() => {
                form.resetFields();
                setFilteredEvents(events);
              }}>
              Xóa bộ lọc
            </Button>
          </Form.Item>
        </Form>

        <Table
          columns={columns}
          dataSource={filteredEvents}
          rowKey="id"
          loading={loading}
          scroll={{ x: true }}
        />
      </Card>

      {/* Modal tạo/chỉnh sửa sự kiện */}
      <Modal
        title={isEditMode ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={800}
        destroyOnClose>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            priority: 5,
          }}>
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả ngắn"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Nội dung chi tiết (HTML)"
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}>
            <TextArea rows={6} />
          </Form.Item>

          <Form.Item
            label="Thời gian diễn ra"
            name="dateRange"
            rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}>
            <RangePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            label="URL thumbnail"
            rules={[{ required: true, message: "Vui lòng nhập URL Thumbnail" }]}
            name="thumbnail">
            <Input />
          </Form.Item>

          <Form.Item
            label="Đường dẫn (Slug)"
            name="slug"
            tooltip="Để trống để tự động tạo từ tiêu đề">
            <Input />
          </Form.Item>

          <Form.Item
            label="Độ ưu tiên"
            name="priority"
            rules={[{ required: true, message: "Vui lòng chọn độ ưu tiên" }]}>
            <Select>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Option key={num} value={num}>
                  {num}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="URL chia sẻ"
            name="shareUrl"
            rules={[{ required: true, message: "Vui lòng nhập URL chia sẻ" }]}>
            <Input />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditMode ? "Cập nhật" : "Tạo mới"}
              </Button>
              <Button onClick={() => setVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem trước ảnh */}
      <Modal visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default EventList;
