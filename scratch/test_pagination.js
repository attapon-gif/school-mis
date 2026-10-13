function testPagination(totalItems, currentPage, pageSize) {
  const actualPageSize = pageSize === 'all' ? totalItems : parseInt(pageSize, 10);
  const totalPages = Math.ceil(totalItems / actualPageSize) || 1;

  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  const startIdx = (currentPage - 1) * actualPageSize;
  const endIdx = Math.min(startIdx + actualPageSize, totalItems);

  console.log(`Total: ${totalItems}, Page: ${currentPage}/${totalPages}, PageSize: ${pageSize}`);
  console.log(`Showing ${startIdx + 1} - ${endIdx}`);
  console.log('Buttons:', rangeWithDots.join(' '));
  console.log('---');
}

testPagination(378, 1, 25);
testPagination(378, 2, 25);
testPagination(378, 8, 25);
testPagination(378, 16, 25);
testPagination(378, 1, 'all');
