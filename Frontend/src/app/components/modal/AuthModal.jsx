"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Modal, Tabs, Form, Input, Button, message } from "antd";
import { useAuth } from "../../store/UseAuth";

const AuthModal = ({ open, onClose }) => {
	const { login, register, loading } = useAuth();
	const [tab, setTab] = useState("login");
	const formKey = open ? "open" : "closed";

	async function onFinishRegister(values) {
		const { ok, error } = await register({
			username: values.username,
			email: values.email,
			password: values.password,
		});
		if (!ok) {
			return message.error(error || "Register failed");
		}
		message.success("Register successful. Please login.");
		setTab("login");

		onClose?.();
	}

	async function onFinishLogin(values) {
		const { ok, error } = await login({ username: values.username, password: values.password });
		if (!ok) {
			return message.error(error || "Login failed");
		}
		message.success("Login successful");
	}

	return (
		<Modal
			open={open}
			onCancel={onClose}
			footer={null}
			centered
			width={400}
			title={
				<span className="font-semibold text-xl">
					Welcome to Pocket Notes
				</span>
			}
		>
			<Tabs
				activeKey={tab}
				onChange={(key) => setTab(key)}
				items={[
					{
						key: "login",
						label: "Login",
						children: (
							<Form
								key={`login-${formKey}`}
								layout="vertical"
								onFinish={onFinishLogin}
								preserve={false}
							>
								<Form.Item
									name="username"
									label="Username"
									rules={[
										{
											required: true,
											message:
												"Please enter your username",
										},
									]}
								>
									<Input
										type="text"
										placeholder="Username"
										className="mb-4"
									/>
								</Form.Item>
								<Form.Item
									name="password"
									label="Password"
									rules={[
										{
											required: true,
											message:
												"Please enter your password",
										},
									]}
								>
									<Input
										type="password"
										placeholder="Password"
										className="mb-4"
									/>
								</Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									className="bg-(--secondary-color) w-full"
									block
								>
									Login
								</Button>
							</Form>
						),
					},
					{
						key: "register",
						label: "Register",
						children: (
							<Form
								key={`login-${formKey}`}
								layout="vertical"
								onFinish={onFinishRegister}
								preserve={false}
							>
								<Form.Item
									name="username"
									label="Username"
									rules={[
										{
											required: true,
											message:
												"Please enter your username",
										},
									]}
								>
									<Input
										type="text"
										placeholder="Username"
										className="mb-4"
									/>
								</Form.Item>
								<Form.Item
									name="email"
									label="Email"
									rules={[
										{
											required: true,
											message: "Please enter your email",
										},
									]}
								>
									<Input
										type="email"
										placeholder="Email"
										className="mb-4"
									/>
								</Form.Item>
								<Form.Item
									name="password"
									label="Password"
									rules={[
										{
											required: true,
											message:
												"Please enter your password",
										},
									]}
								>
									<Input
										type="password"
										placeholder="Password"
										className="mb-4"
									/>
								</Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									className="bg-(--secondary-color) w-full"
									block
								>
									Register
								</Button>
							</Form>
						),
					},
				]}
			/>
		</Modal>
	);
};

export default AuthModal;
