import React, { useEffect, useState } from 'react'

export default function PostForm({ initialValue = null, onCancel, onSubmit }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (initialValue) {
      setTitle(initialValue.title ?? '')
      setContent(initialValue.content ?? '')
    } else {
      setTitle('')
      setContent('')
    }
  }, [initialValue])

  function handleSubmit(e) {
    e.preventDefault()
    const payload = { title: title.trim(), content: content.trim() }
    if (initialValue?.id != null) payload.id = initialValue.id
    onSubmit?.(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 p-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--panel)]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{initialValue ? 'Edit Post' : 'Add Post'}</h2>
      </div>
      <div className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm text-[color:var(--muted)]">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-[color:var(--border)] bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
            placeholder="Enter title"
            required
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-[color:var(--muted)]">Content</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-md border border-[color:var(--border)] bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--accent)] min-h-[100px]"
            placeholder="Write content..."
            required
          />
        </label>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" className="rounded-md bg-[color:var(--accent)] px-4 py-2 text-black font-medium hover:opacity-90">
          {initialValue ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="rounded-md border border-[color:var(--border)] px-4 py-2 hover:bg-[color:var(--row)]">
          Cancel
        </button>
      </div>
    </form>
  )
}
