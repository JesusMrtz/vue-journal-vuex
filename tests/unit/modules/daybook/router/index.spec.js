import daybookRouter from '@/modules/daybook/router'

describe ('Pruebas en el routerModule del Daybook', () => {
  it('El router debe de tener esta configuración', async () => {
    expect(daybookRouter).toMatchObject({
      name: 'daybook',
      component: expect.any(Function),
      redirect: { name: 'no-entry' },
      children: [
        {
          path: '',
          name: 'no-entry',
          component: expect.any(Function)
        },
        {
          path: ':id',
          name: 'entry',
          component: expect.any(Function),
          props: expect.any(Function)
        }
      ]
    })


    const promiseRoutes = []
    daybookRouter.children.forEach( child => promiseRoutes.push(child.component()) )

    // Ejecutar todas la promesas
    const routes = (await Promise.all(promiseRoutes)).map(r => r.default.name)

    expect(routes).toContain('EntryView')
    expect(routes).toContain('NoEntrySelected')

  })

  it ('Debe de retornar el ID de la ruta', () => {
    const route = {
      params: {
        id: '3'
      }
    }

    // OBtener la ruta con el name : "entry"
    const entryRoute = daybookRouter.children.find(route => route.name === 'entry')
    expect( entryRoute.props(route) ).toEqual({ id: '3' })
  })
})