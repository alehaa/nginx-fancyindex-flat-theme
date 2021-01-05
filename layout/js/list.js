/* This file is part of nginx-fancyindex-flat-theme.
 *
 * nginx-fancyindex-flat-theme is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * nginx-fancyindex-flat-theme is distributed in the hope that it will be
 * useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
 * Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see
 *
 *  http://www.gnu.org/licenses/
 *
 *
 * Copyright (C)
 *  2018 Alexander Haase <ahaase@alexhaase.de>
 *
 *
 * NOTE: The following comment will be used as short version of the copyright
 *       notice above to be included in compressed files, too.
 */

/*!
 *
 * This file is part of the nginx-fancyindex-flat-theme, licensed under the GNU
 * General Public License. See the LICENSE file for details.
 *
 * Copyright (C)
 *  2018 Alexander Haase <ahaase@alexhaase.de>
 */

/**
 * Apply the styling of the directory listing table.
 *
 * The default directory listing table can be styled only basically via CSS.
 * This function will apply additional styles to it and adds an extra column for
 * icons.
 */
function generateList()
{
  /**
   * Get the filetype of a specific file based on the file extension.
   *
   *
   * @param string filename the filename to be checked
   *
   * @return string the file's filetype
   */
  function getFileType(filename)
  {
    /* First, check if the file is a directory (i.e. has a trailing slash). */
    if (filename.endsWith('/'))
      return 'folder';

    /* For all other kinds of files, check the file extension (converted to
     * lower case to ignore the extension's case). */
    switch (filename.split('.').pop().toLowerCase())
      {
      case 'txt':
        return 'text';

      case 'pdf':
        return 'pdf';

      case 'bmp':
      case 'gif':
      case 'jpeg':
      case 'jpg':
      case 'png':
      case 'tif':
      case 'tiff':
        return 'image';

      case 'aac':
      case 'aiff':
      case 'm4a':
      case 'mp3':
      case 'ogg':
      case 'opus':
      case 'wav':
        return 'audio';

      case 'amv':
      case 'avi':
      case 'flv':
      case 'm4v':
      case 'mkv':
      case 'mov':
      case 'mp4':
      case 'm4p':
      case 'mpeg':
      case 'mpg':
      case 'ogv':
      case 'vob':
      case 'webm':
      case 'wmv':
        return 'video';

      case '7z':
      case 'a':
      case 'apk':
      case 'ar':
      case 'bin':
      case 'bz2':
      case 'cab':
      case 'dmg':
      case 'gz':
      case 'iso':
      case 'jar':
      case 'lz':
      case 'lzma':
      case 'lzo':
      case 'pak':
      case 'partimg':
      case 'rar':
      case 's7z':
      case 'tar':
      case 'tbz2':
      case 'tgz':
      case 'tlz':
      case 'txz':
      case 'xz':
      case 'zip':
        return 'archive';

      case 'doc':
      case 'docx':
      case 'odt':
      case 'rtf':
        return 'word';

      case 'csv':
      case 'ods':
      case 'xls':
      case 'xlsx':
        return 'excel';

      case 'odp':
      case 'ppt':
      case 'pptx':
        return 'powerpoint';

      case 'c':
      case 'class':
      case 'cpp':
      case 'cs':
      case 'h':
      case 'hpp':
      case 'hxx':
      case 'java':
      case 'py':
      case 'sh':
      case 'swift':
      case 'vb':
        return 'code';
      }
  }


  function getThumbnail(file)
  {
    var dimensions="-128x128"
    var pos = file.lastIndexOf(".");
    var ext = "";
    var fileNoExt = filename;
    if (pos >= 0) {
      ext = file.substr(pos, file.length);
      fileNoExt = file.substr(0, pos);
    }
    return "/thumbs" + window.location.pathname + "/" + fileNoExt + dimensions + ext;
  }

  /**
   * Get the font awesome icon to be used for a specific filetype.
   *
   *
   * @param string filetype the filetype for wich an icon is required
   *
   * @return string the HTML icon tag to be used
   */
  function getIcon(filetype)
  {
    /**
     * Get the font awesome class of the icon to be used.
     *
     *
     * @param string filetype the filetype for wich an icon is required
     *
     * @return string the icon class to be used
     */
    function getFontAwesomeClass(filetype)
    {
      switch (filetype)
        {
        case 'folder':
          return 'fa-folder';

        case 'archive':
        case 'audio':
        case 'code':
        case 'excel':
        case 'image':
        case 'pdf':
        case 'powerpoint':
        case 'text':
        case 'video':
        case 'word':
          return 'fa-file-' + filetype + '-o';

        /* If none of the previous types matched, use a generic file icon. */
        default:
          return 'fa-file-o';
        }
    }

    /* Return the file icon HTML tag to be used for the file passed to this
     * function. */
    return '<i class="fa fa-fw ' + getFontAwesomeClass(filetype) +
           '" aria-hidden="true"></i>';
  }


  var list = document.getElementById("list");

  /* Remove the default style attributes and add the bootstrap table classes. By
   * default, text will be not wrapped. However, long filenames will be, as they
   * use the 'filename' class (see below). */
  list.removeAttribute("cellpadding");
  list.removeAttribute("cellspacing");
  list.classList.add('table', 'table-sm', 'table-hover', 'text-nowrap');

  /* As file size and last-modified date will be hidden at mobile devices, also
   * hide the the table header for mobile devices, as it's unneccessary for the
   * single remaining cell containig the filename. */
  list.tHead.children[0].classList.add('d-none', 'd-md-table-row');

  /* If we're in a subdirectory, remove the 'Parent Directory' row, as the
   * navigation is covered by the breadcrumbs. */
  if (window.location.pathname != '/')
    list.deleteRow(1);

  /* Iterate over all rows (including the thead) to add individual classes for
   * each cell or adding new cells. */
  for (var i = 0, row; row = list.rows[i]; i++)
    {
      /* Add a new cell for the file-type icon. */
      filename = row.cells[0].children[0].innerHTML;
      filetype = getFileType(filename);
      row.insertCell(0).innerHTML = (i > 0) ? getIcon(filetype) : '';

      /* Set the classes for all cells. All cells except the filename will fit
       * their contents. The filename cell is the only allowed to wrap. The last
       * two cells (file size and last-modified date) will be hidden on small
       * (i.e. mobile) devices.*/
      row.cells[0].classList.add('col-auto', 'align-middle');
      row.cells[1].classList.add('col', 'filename', 'align-middle');
      row.cells[2].classList.add('col-auto', 'd-none', 'd-md-table-cell', 'align-middle');
      row.cells[3].classList.add('col-auto', 'd-none', 'd-md-table-cell', 'align-middle');

      /* If the file is a picture, add the data attribute for lightbox2, so one
       * is able to easily navigate through the pictures. */
      if (filetype == 'image') {
        row.cells[1].children[0].setAttribute('data-lightbox', 'roadtrip');
        row.cells[1].children[0].innerHTML = '<img class="thumb" src="'+getThumbnail(filename)+'"></img>&nbsp;' + row.cells[1].children[0].innerHTML;
      }
    }
}

