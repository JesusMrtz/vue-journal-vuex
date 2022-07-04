export default {
  name: 'daybook',
  component: () => import(/* webpackChunkName: "DayBookLayoutChunk" */ '@/modules/daybook/layouts/DayBookLayout'),
  redirect: { name: 'no-entry' },
  children: [
    {
      path: '',
      name: 'no-entry',
      component: () => import(/* webpackChunkName: "NoEntrySelectedChunk" */ '@/modules/daybook/views/NoEntrySelectedView')
    },
    {
      path: ':id',
      name: 'entry',
      component: (() => import(/* webpackChunkName: "EntryChunk" */'@/modules/daybook/views/EntryView')),
      props: (route) => {
        const id = route.params.id
        return { id }
      }
    }
  ]
}