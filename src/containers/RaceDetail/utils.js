export function formatSize(size) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0, sizeNumber = size;
  for (let length = units.length; sizeNumber >= 1024 && index < length; index ++)
    sizeNumber /= 1024;
  return (sizeNumber == null || isNaN(sizeNumber) ? '?' : sizeNumber.toFixed(2)) + ' ' + units[index];
}

export function selectFiles(cb, options) {
  options = options || {};
  const file = document.createElement('input');
  file.setAttribute('type', 'file');
  if (options.accept)
    file.setAttribute('accept', options.accept);
  if (options.multiple)
    file.multiple = true;
  file.onchange = function () {
    if (this.files && this.files.length) {
      cb(options.multiple ? this.files : this.files[0]);
    }
  };

  // IE fix
  file.setAttribute('style', 'display:none');
  document.body.appendChild(file);

  file.click();
  document.body.removeChild(file);
}
