import { mount, shallow } from 'enzyme'
import { ReactElement } from 'react'
import * as util from 'jest-matcher-utils'
import MatcherUtils = jest.MatcherUtils

declare global {
  namespace jest {
    interface Matchers<R> {
      toRenderWithoutError(options?: never): R, // tslint:disable-line:no-any
    }
  }
}

const indent = (str: string): string =>
  str.split('\n').map(s => '  ' + s).join('\n')

export type JestResult = { message: () => string, pass: boolean }

declare const window: any // tslint:disable-line:no-any

export const isInBrowserLikeEnvironment = () => typeof window !== 'undefined'

export function toRenderWithoutError(
  this: MatcherUtils,
  node: ReactElement<any>, // tslint:disable-line:no-any
  options?: never // TODO ?
): JestResult {
  const consoleErrorTemp = console.error
  const consoleWarnTemp = console.warn
  const errorConsoleSpy = jest.fn()
  const warnConsoleSpy = jest.fn()

  console.error = errorConsoleSpy
  console.warn = warnConsoleSpy

  let renderException: Error | undefined
  try {
    isInBrowserLikeEnvironment() ? mount(node) : shallow(node)
  } catch (err) {
    renderException = err
  }
  const errorMessages = errorConsoleSpy.mock.calls.map(params => params.join(', '))
  const warningMessages = warnConsoleSpy.mock.calls.map(params => params.join(', '))

  console.error = consoleErrorTemp
  console.warn = consoleWarnTemp

  const pass =
    errorMessages.length === 0 &&
    warningMessages.length === 0 &&
    renderException == null

  return {
    message: () => {
      if (this.isNot) {
        return (
          `${util.matcherHint('.toRenderWithoutError')}\n` +
          `\n` +
          `Expected to encounter an error, warning or an exception during rendering`
        )
      }

      return (
        (warningMessages.length === 0 ? '' : (
          `${util.pluralize('Warning', warningMessages.length)} logged during rendering:\n` +
          warningMessages.map(indent).join('\n') +
          '\n'
        )) +
        (errorMessages.length === 0 ? '' : (
          `${util.pluralize('Error', errorMessages.length)} logged during rendering:\n` +
          errorMessages.map(indent).join('\n') +
          '\n'
        )) +
        (renderException == null ? '' : renderException.toString())
      )
    },
    pass,
  }
}
