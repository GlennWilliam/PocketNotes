import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Segmented, message } from "antd";
import RichTextEditor from "../RichTextEditor";
import { useNote } from "@/app/store/UseNote";
import { useAuth } from "@/app/store/UseAuth";

function isEmptyHtml(html) {
	const text = (html || "")
		.replace(/<[^>]+>/g, "")
		.replace(/&nbsp;/g, " ")
		.trim();
	return text.length === 0;
}

const NoteEditModal = ({ note, open, onClose, onUpdated }) => {
	const [form] = Form.useForm();
	const [status, setStatus] = useState("public");
	const [loading, setLoading] = useState(false);
	const { update } = useNote();
	const { token } = useAuth();

	useEffect(() => {
		if (note) {
			setStatus(note.status || "public");
			form.setFieldsValue({
				title: note.title,
				content: note.content,
				password_hint: note.password_hint,
			});
		}
	}, [note, open, form]);

	async function onFinishUpdateNote(values) {
		try {
			if (!token) {
				message.warning("Please login first!");
				onClose?.();
				return;
			}
			setLoading(true);
			const payload = {
				title: (values.title || "Untitled").trim(),
				content: (values.content || "").trim(),
				status,
				...(status === "protected"
					? {
							password: values.password,
							password_hint: values.password_hint,
					  }
					: {}),
			};

			const updated = await update(note.id, payload);
			message.success("Note updated successfully");
			onUpdated?.(updated);
			form.resetFields();
			setStatus("public");
			onClose?.();
		} catch (error) {
			message.error(error?.message || "Failed to update note");
		} finally {
			setLoading(false);
		}
	}

	const segmentedList = [
		{ label: "Public", value: "public" },
		{ label: "Private", value: "private" },
		{ label: "Protected", value: "protected" },
	];

	return (
		<Modal
			open={open}
			onCancel={onClose}
			centered
			okText="Save Changes"
			confirmLoading={loading}
			className="!rounded-2xl"
			width={800}
			styles={{
				content: { borderRadius: "16px" },
				body: { borderRadius: "16px" },
			}}
			okButtonProps={{ form: "note-edit-form", htmlType: "submit" }}
			title={
				<span className="font-semibold text-xl">Edit Your Note</span>
			}
		>
			<Form
				form={form}
				id="note-edit-form"
				layout="vertical"
				onFinish={onFinishUpdateNote}
				preserve={false}
			>
				<Form.Item
					label="Title"
					name="title"
					rules={[
						{
							required: true,
							message: "Please enter the note title",
						},
					]}
				>
					<Input placeholder="Enter note title" maxLength={150} />
				</Form.Item>

				<Form.Item
					label="Content"
					name="content"
					rules={[
						{
							validator: (_, value) => {
								if (isEmptyHtml(value)) {
									return Promise.reject(
										new Error(
											"Please enter the note content"
										)
									);
								}
								return Promise.resolve();
							},
						},
					]}
				>
					<RichTextEditor placeholder="Edit your notes..." />
				</Form.Item>

				<div className="flex flex-col gap-4 justify-between">
					<Form.Item>
						<Segmented
							options={segmentedList}
							value={status}
							onChange={setStatus}
						/>
					</Form.Item>

					{status === "protected" && (
						<div className="flex-1 grid grid-cols md:grid-cols-2 gap-3">
							<Form.Item
								label="Password"
								name="password"
								rules={[
									{
										required: true,
										message: "Please enter the password",
									},
								]}
							>
								<Input.Password placeholder="Enter password" />
							</Form.Item>

							<Form.Item
								name="password_hint"
								label="Password Hint (Optional)"
							>
								<Input placeholder="Enter password hint" />
							</Form.Item>
						</div>
					)}
				</div>
			</Form>
		</Modal>
	);
};

export default NoteEditModal;
