import React, { use } from 'react'
import { useState, useEffect } from 'react';
import { Modal, Form, Input, Segmented, message } from "antd";
import RichTextEditor from '../RichTextEditor';
import { useNote } from '@/app/store/UseNote';
import { useAuth } from '@/app/store/UseAuth';

function isEmptyHtml (html){
	const text = (html || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
	return text.length === 0;
}

const NoteCreateModal = ({ open, onClose, onCreated }) => {
	const formKey = open ? "open" : "closed";
	const [form] = Form.useForm();
	const [status, setStatus] = useState('public');
	const [loading, setLoading] = useState(false);
	const { createNote } = useNote();
	const { token } = useAuth();

	useEffect(() => {
		if (!open) {
			setStatus('public');
		}
	}, [open]);
	
	async function onFinishCreateNote(values) {
		try {
			if(!token) {
				message.warning("Please login first!");
				onClose?.();
				return;
			}
			setLoading(true);
			const payload = {
				title: (values.title || "Untitled").trim(),
				content: (values.content || "").trim(),
				status,
				...(status === 'protected' ? {
					password: values.password,
					password_hint: values.password_hint
				} : {}),
				
			};
			const note = await createNote(payload);
			setLoading(false);
			message.success("Note created successfully");
			onCreated?.(note);
			onClose?.();
			setStatus('public');
			form.resetFields();
		} catch (error) {
			message.error(error?.message || "Failed to create note");
			setLoading(false);
		} finally {
			setLoading(false);
			onClose?.();
		}
	}

	const segmentedList = [
		{ label: <span className="inline-flex items-center gap=2">Public</span>, value: 'public' },
		{ label: <span className="inline-flex items-center gap=2">Private</span>, value: 'private' },
		{ label: <span className="inline-flex items-center gap=2">Protected</span>, value: 'protected' },
	]

  return (
	<Modal
		open={open}
		onCancel={onClose}
		centered
		okText="Create Note"
		confirmLoading={loading}
		className="!rounded-2xl"
		width={800}
		styles={{ content: { borderRadius: '16px' }, body: { borderRadius: '16px' } }}
		okButtonProps={{ form: "create-note-form", htmlType: "submit" }}
		title={
			<span className="font-semibold text-xl">
				Create New Note
			</span>
		}
	>
		<Form
			form={form}
			key={`NoteCreateModal`}
			id='create-note-form'
			layout="vertical"
			onFinish={onFinishCreateNote}
			preserve={false}
		>
			<Form.Item
				label="Title"
				name="title"
				rules={[{ required: true, message: "Please enter the note title" }]}
			>
				<Input placeholder="Enter note title" maxLength={150}/>
			</Form.Item>

			<Form.Item
				label="Content"
				name="content"
				rules={[{ validator: (_, value) => {
					if (isEmptyHtml(value)) {
						return Promise.reject(new Error("Please enter the note content"));
					}
					return Promise.resolve();
				} }]}
			>
				<RichTextEditor placeholder="What is on your mind today?" />
			</Form.Item>

			<div className="flex flex-col gap-4 justify-between">
				<Form.Item>
					<Segmented
						options={segmentedList}
						value={status}
						onChange={setStatus}
					/>
					
				</Form.Item>

				{status === 'protected' && (
					<div className="flex-1 grid grid-cols md:grid-cols-2 gap-3">
						<Form.Item
							label="Password"
							name="password"
							rules={[{ required: true, message: "Please enter the password for protected note" }]}	
						>
							<Input.Password placeholder="Enter password" />
						</Form.Item>

						<Form.Item
							name="password_hint"
							label="Password Hint (Optional)"
						>
							<Input placeholder="Enter password hint"/>
						</Form.Item>

					</div>
					
				)}
			</div>
		</Form>
	</Modal>
  )
}

export default NoteCreateModal