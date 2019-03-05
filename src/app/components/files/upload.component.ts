import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Kinvey } from 'kinvey-angular2-sdk';
import * as myGlobals from '../../globals';
@Component({
  selector: 'app-upload',
  moduleId: module.id,
  templateUrl: './upload.component.html',
})
export class UploadComponent {
  role : string;
  file: File;
  filename: string;
  public: boolean;
  showProgress = false;
  final: string;

  constructor(private router: Router) {}

  ngOnInit(){
    const activeUser = Kinvey.User.getActiveUser();
      this.role=activeUser.data['Role'];
  }

  fileChangeEvent(fileInput: any) {
    this.file = fileInput.target.files[0];
  }

  upload() {
    if (this.file) {

      let filename = this.file.name;//.replace('MEZOTIXC.', '');
      this.public = true;
      //filename = 'v' + filename[0] + '.' + filename[1] + filename[2] + 'r';
      // Show progress
      this.showProgress = true;

      // Create file metadata
      const metadata: Kinvey.FileMetadata = {
        mimeType: 'application/octet-stream',
        filename: filename,
        public: this.public
      };

      // Create request options
      const options: Kinvey.RequestOptions = {
        timeout: 600000
      };

      // Upload the file
      Kinvey.Files.upload(
        this.file, // File to upload
        metadata,
        options,
      )
        .then(() => {
          this.router.navigate(['/files']);
        })
        .catch((error: Kinvey.BaseError) => {
          // Hide progress
          this.showProgress = false;

          // Show error message
          alert(error.message);
        });
    } else {
      // Hide progress
      this.showProgress = false;

      // Show error message
      alert('Please select a file to upload.');
    }
  }
}
