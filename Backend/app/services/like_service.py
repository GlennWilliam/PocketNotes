from app.models.like import Like
from app.models.notes import Notes
from app.models.user import User
from app.models.notes import Notes
from sqlalchemy import desc
from app import db

def toggle_like(user_id, note_id):
	user = User.query.get(user_id)
	if not user:
		return None, "User not found"
	
	note = Notes.query.get(note_id)
	if not note:
		return None, "Note not found"
	
	like = Like.query.filter(Like.user_id == user_id, Like.note_id == note_id).first()
	if like:
		try:
			db.session.delete(like)
			db.session.commit()
			return True, "Like removed"
		except Exception as e:
			db.session.rollback()
			return None, "Error removing like: " + str(e)
	else:
		try:
			new_like = Like(user_id=user_id, note_id=note_id)
			db.session.add(new_like)
			db.session.commit()
			return True, "Like added"
		except Exception as e:
			db.session.rollback()
			return None, "Error adding like: " + str(e)
		
def list_my_favorites(user_id, page=1, per_page=12):
    base = (
        db.session.query(Like)
        .join(Notes, Like.note_id == Notes.id)
        .filter(
            Like.user_id == user_id,
            Notes.deleted_at.is_(None),
            ((Notes.status == "public") | (Notes.user_id == user_id)),
        )
        .order_by(desc(Like.created_at)) 
	) 

    total = base.count()
    likes = (
        base
        .offset((max(page, 1) - 1) * max(per_page, 1))
        .limit(per_page)
        .all()
    )

    items = []
    for lk in likes:
        n = lk.note
        data = n.to_json(include_user=True)
        data["like"] = True              
        items.append(data)

    meta = {
        "page": page,
        "per_page": per_page,
        "total": total,
        "pages": (total + per_page - 1) // per_page if per_page else 1,
        "sort": "created_at",
        "order": "desc",
        "q": "",
    }
    return items, meta, "get note like"