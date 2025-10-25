import React from 'react'
import Card from 'antd/es/card/Card'
import { Avatar, Tooltip } from 'antd'
import { RiLockLine, RiShadowFill, RiShareForwardFill, RiStackFill } from 'react-icons/ri'

const CardNote = ({ note }) => {
  return (
	<div className="relative">
		<Card className="note-card border-0 !rounded-2xl cursor-pointer"
			hoverable
			tabIndex={0}>
			
			<h3 className="font-semibold mb-2 text-neutral-800 text-xl sm:text-base">
				{note.title}
			</h3>
			<div
				className="text-base text-neutral-800 font-medium break-words"
				dangerouslySetInnerHTML={{ __html: note?.content }}
					
			/>
			<div className="flex flex-row justify-between gap-3 mt-4">
				<div className="flex items-center gap-2 ">
					<Avatar
						src={note?.user?.profile || undefined}
						alt="Image User"
						size={40}
					/>
					<div className="flex flex-col">
						<h4 className="text-base font-semibold truncate">
							{note?.user?.username || "Unknown User"}
						</h4>
						<p className="text-sm text-neutral-500">
							{note?.date || "Unknown Date"}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Tooltip title="Private">
						<RiLockLine size={20} className="text-neutral-600" />
					</Tooltip>

					<Tooltip title="Favorite">
						<RiStackFill size={20} className="text-neutral-600" />
					</Tooltip>

					<Tooltip title="Share">
						<RiShareForwardFill size={20} className="text-neutral-600" />
					</Tooltip>
				</div>
			</div>
		</Card>
	</div>
  )
}

export default CardNote