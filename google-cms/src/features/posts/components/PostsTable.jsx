import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePost } from '../api'
import { useStorePost } from '../store'
import PostsTableLoading from './PostsTableLoading'

export default function PostsTable({ onEdit }) {
  const posts = useStorePost((s) => s.posts)
  const setPosts = useStorePost((s) => s.setPosts)
  const qc = useQueryClient()

  const delMutation = useMutation({
    mutationFn: ({ id }) => deletePost({ id }),
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: ['posts'] })
      const prev = qc.getQueryData(['posts'])
      // optimistic remove
      const next = (prev || posts).filter((p) => String(p.id) !== String(vars.id))
      qc.setQueryData(['posts'], next)
      setPosts(next)
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(['posts'], ctx.prev)
        setPosts(ctx.prev)
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <PostsTableLoading>
            {posts.map((row, idx) => (
              <tr key={row.id ?? idx}>
                <td className="mono">{row.id ?? '-'}</td>
                <td>{row.title ?? '-'}</td>
                <td className="content">{row.content ?? '-'}</td>
                <td className="mono">{row.created_at ?? '-'}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      className="rounded border border-[color:var(--border)] px-3 py-1 text-sm hover:bg-[color:var(--row)]"
                      onClick={() => onEdit?.(row)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded bg-red-500/80 px-3 py-1 text-sm text-black hover:opacity-90"
                      onClick={() => delMutation.mutate({ id: row.id })}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </PostsTableLoading>
        </tbody>
      </table>
    </div>
  )
}
