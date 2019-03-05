import { ChangeDetectorRef, Component, OnInit , NgZone} from '@angular/core';
import { Router } from '@angular/router';
import { Kinvey } from 'kinvey-angular2-sdk';
import { File } from '../../models/file';
import * as myGlobals from '../../globals';
@Component({
  selector: 'app-files',
  moduleId: module.id,
  templateUrl: './files.component.html',
})
export class FilesComponent implements OnInit  {
  files: File[];
  role : string;
  constructor(private router: Router, private cd: ChangeDetectorRef, private zone: NgZone) {}

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async ngOnInit() {
    const activeUser = Kinvey.User.getActiveUser();
      this.role=activeUser.data['Role'];
    await this.delay(myGlobals.ttm);
    const u = Kinvey.User.getActiveUser();
    if(u==null){
      this.router.navigate(['/login']);
    }
    else{
    this.reload();
    }
  }

  reload() {
    Kinvey.Files.find<File>()
      .then((files) => {
        this.files = files;
        this.cd.detectChanges();
      });
  }

  upload() {
    this.zone.run(() =>  this.router.navigate(['/upload']));
  }

  remove() {
    const ids = this.files.filter(file => file.selected).map(file => file._id);

    if (ids.length === 0) {
      return alert('Please select a file you would like to remove.');
    }

    if (ids.length > 1) {
      return alert('Please select only one file to remove.');
    }

    Kinvey.Files.removeById(ids[0])
      .then(() => {
        this.reload();
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("files_table");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }
}
