import * as React from 'react'
import { isInBrowserLikeEnvironment, toRenderWithoutError } from './toRenderWithoutError'

const isInBrowserEnvironment = isInBrowserLikeEnvironment()

describe('toRenderWithoutError', () => {
  beforeAll(() => expect.extend({ toRenderWithoutError }))

  it('Passes for components which mount without incident', () => {
    expect(<div/>).toRenderWithoutError()
    expect(React.createElement('div')).toRenderWithoutError()
    const SimpleComponent = () => <div><span/></div>
    expect(<SimpleComponent/>).toRenderWithoutError()
  })

  it('Fails if the component throws during rendering', () => {
    // tslint:disable-line:no-any
    const ThrowComponent = (props: any) =>
      <div className={props.foo.notHere}/>

    expect(<ThrowComponent/>).not.toRenderWithoutError()
  })

  it('Fails if the component explicitly throws during rendering', () => {
    // tslint:disable-line:no-any
    const ThrowErrorComponent = () => {
      throw new Error('Unexpected condition')
      return (<div/>)
    }

    expect(<ThrowErrorComponent/>).not.toRenderWithoutError()
  })

  it('Fails if the component logs any console errors while rendering', () => {
    const ErrorComponent = () => {
      console.error('some error')
      return <div/>
    }

    expect(<ErrorComponent/>).not.toRenderWithoutError()
  })

  it('Fails if the component logs any console warnings while rendering', () => {
    const WarnComponent = () => {
      console.warn('some warning')
      return <div/>
    }

    expect(<WarnComponent/>).not.toRenderWithoutError()
  })

  it('Fails if React logs any errors while rendering', () => {
    const ErrorComponent = () =>
      <div>{[1, 2, 3].map(num => <span>{num}</span>)}</div>

    expect(<ErrorComponent/>).not.toRenderWithoutError()
  })

  const browserDescribe = isInBrowserEnvironment ? describe : xdescribe
  browserDescribe('browser based environment', () => {
    it('Fails if a nested component logs any console errors while rendering', () => {
      const WarnComponent = () => {
        console.error('some error')
        return <div/>
      }

      const ShallowComponent = () => <WarnComponent/>

      expect(<ShallowComponent/>).not.toRenderWithoutError()
    })

    it('Fails if a child component logs any console errors while rendering', () => {
      const WarnComponent = () => {
        console.error('some error')
        return <div/>
      }

      const ParentComponent = ({ children }: any) => <div>{children}</div>

      expect(<ParentComponent><WarnComponent/></ParentComponent>).not.toRenderWithoutError()
    })

    it('Fails if React logs any warnings while rendering', () => {
      const WarnComponent = () =>
        React.createElement('div' as any, { 'class': 7 })

      expect(<WarnComponent/>).not.toRenderWithoutError()
    })
  })

  const nodeDescribe = isInBrowserEnvironment ? xdescribe : describe
  nodeDescribe('node based environment', () => {
    it('Will not fail if a nested component logs any console errors while rendering', () => {
      const WarnComponent = () => {
        console.error('some error')
        return <div/>
      }

      const ShallowComponent = () => <WarnComponent/>

      expect(<ShallowComponent/>).toRenderWithoutError()
    })

    it('Passes if a child component would log a console errors while rendering', () => {
      const ParentComponent = ({ children }: any) => <div>{children}</div>
      const ErrorChild = () => {
        console.error('some error')
        return <div/>
      }

      expect(<ParentComponent><ErrorChild/></ParentComponent>).toRenderWithoutError()
    })

    it('Passes if React would log any warnings while rendering', () => {
      const WarnComponent = () =>
        React.createElement('div' as any, { 'class': 7 })

      expect(<WarnComponent/>).toRenderWithoutError()
    })
  })
})
