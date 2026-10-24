'use client'

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from './Logo'
import { isActive } from './NavLinks'
import { XIcon } from './icons'

const MobileNav = () => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden dark:text-gray-200 dark:hover:bg-gray-800"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <Transition show={open} as={Fragment}>
        <Dialog as="div" onClose={setOpen} className="relative z-80 lg:hidden">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm" />
          </TransitionChild>
          <TransitionChild
            as={Fragment}
            enter="transition ease-out duration-200 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in duration-150 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="fixed inset-y-0 right-0 flex w-full max-w-xs flex-col bg-white shadow-2xl dark:bg-gray-950">
              <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
                <span className="font-display flex items-center gap-2 font-bold">
                  <Logo className="h-7 w-7" /> Menu
                </span>
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <nav aria-label="Mobile" className="flex-1 overflow-y-auto p-3">
                {headerNavLinks.map((link) => {
                  const active = isActive(pathname, link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={`block rounded-lg px-3 py-3 text-base font-medium ${
                        active
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300'
                          : 'text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-900'
                      }`}
                    >
                      {link.title}
                    </Link>
                  )
                })}
              </nav>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileNav
