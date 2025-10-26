"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Modal, Tabs, Form, Input, Button } from "antd";

const AuthModal = ({ open, onClose }) => {
	const [tab, setTab] = useState("login");
	const formKey = open ? "open" : "closed";
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
