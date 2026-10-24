'use client'

import { FormEvent, useState } from 'react'
import siteMetadata from '@/data/siteMetadata'
import { MailIcon } from '../icons'

// Free form backend: create an access key at https://web3forms.com and set
// NEXT_PUBLIC_WEB3FORMS_KEY. Without it, the page shows an email button instead.
const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY

const inputCls =
  'block w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  if (!accessKey) {
    return (
      <div className="not-prose my-8 rounded-2xl border border-gray-200 p-6 text-center dark:border-gray-800">
        <MailIcon className="text-primary-500 mx-auto h-8 w-8" />
        <p className="mt-3 text-gray-700 dark:text-gray-300">
          The fastest way to reach us is by email.
        </p>
        <a
          href={`mailto:${siteMetadata.email}`}
          className="bg-primary-600 hover:bg-primary-700 mt-4 inline-flex rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
        >
          {siteMetadata.email}
        </a>
      </div>
    )
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const data = new FormData(e.currentTarget)
    data.append('access_key', accessKey as string)
    data.append('subject', `New message from ${siteMetadata.title}`)
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
      const json = await res.json()
      setStatus(json.success ? 'sent' : 'error')
      if (json.success) (e.target as HTMLFormElement).reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="not-prose my-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
        Thanks! Your message has been sent. We usually reply within 2 business days.
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="not-prose my-8 space-y-4 rounded-2xl border border-gray-200 p-6 dark:border-gray-800"
    >
      {/* Honeypot field for bots */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </span>
          <input name="name" required className={inputCls} autoComplete="name" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </span>
          <input name="email" type="email" required className={inputCls} autoComplete="email" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Topic
        </span>
        <select name="topic" className={inputCls} defaultValue="General question">
          <option>General question</option>
          <option>Suggest a tool to review</option>
          <option>Correction or update</option>
          <option>Partnership / advertising</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Message
        </span>
        <textarea name="message" required rows={5} className={inputCls} />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-primary-600 hover:bg-primary-700 rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        {status === 'error' && (
          <p className="text-sm text-rose-600">
            Something went wrong. Please email us at {siteMetadata.email}.
          </p>
        )}
      </div>
    </form>
  )
}
