/**
 * el state es como la data de un compente en view que es reactivo
 */
export default () => ({
  isLoading: true,
  entries: [
    {
      id: new Date().getTime(),
      date: new Date().toDateString(),
      text: 'Adipisicing ullamco esse est voluptate mollit et ex est qui voluptate. Ad labore laborum ipsum minim aliqua id laboris ad velit ipsum cillum. Ad voluptate sint consectetur sit sint nulla ullamco veniam dolor laborum. Excepteur proident laborum aute qui Lorem do aute proident occaecat nulla cupidatat qui labore.',
      picture: null
    },
    {
      id: new Date().getTime() + 200,
      date: new Date().toDateString(),
      text: 'Ea nostrud commodo ullamco aute esse nisi aliquip dolor eu. Incididunt non culpa qui exercitation id nisi eu dolore do officia aute occaecat ut. Nisi magna excepteur sunt enim aliquip proident nostrud ad. Veniam sint enim ex occaecat dolore magna. Dolor pariatur ut quis pariatur laborum ex occaecat.',
      picture: null
    },
    {
      id: new Date().getTime() + 20000,
      date: new Date().toDateString(),
      text: 'Eu deserunt labore non enim deserunt ullamco. Excepteur tempor culpa eiusmod ipsum ea labore eiusmod do do deserunt sunt. Enim adipisicing reprehenderit magna consectetur velit qui in dolor et sit. Voluptate consequat labore nulla elit quis aliqua occaecat nostrud. Sint eu laboris aliquip ea adipisicing esse velit quis veniam nisi sunt mollit.',
      picture: null
    }
  ]
})