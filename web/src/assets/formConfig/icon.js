export let iconCallback = (iconType) => {
  switch (iconType) {
    case 'input':
      return 'edit'
      break;
    case 'select':
      return 'check-square'
      break;
    case 'multiple-input':
      return 'plus-square'
      break;
    case 'date':
      return 'schedule'
      break;
    case 'rate':
      return 'star'
      break;
  }
}
