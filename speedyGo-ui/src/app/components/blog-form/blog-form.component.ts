import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DropdownModule} from "primeng/dropdown";
import {PostService} from "../../services/services/post.service";
import {UpdatePost$Params} from "../../services/fn/post/update-post";
import {NavbarComponent} from "../navbar/navbar.component";
import {NgClass, NgIf} from "@angular/common";
import {SafetyContentService} from "./services/safety-content.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-blog-form',
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    NavbarComponent,
    NgClass,
    NgIf
  ],
  templateUrl: './blog-form.component.html',
  standalone: true,
  styleUrl: './blog-form.component.scss'
})
export class BlogFormComponent implements OnInit{

  postForm: FormGroup;
  postId: number | null = null;
  submitted = false;
  selectedPostCover: any;
  selectedPicture: string | undefined;
  message: { type: string; text: string } | null = null;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private safetyContentService:SafetyContentService,
    private toastService:ToastrService
  ) {
    this.postForm = this.initForm();
  }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id){
      this.postId= +id;
      this.loadPvData(this.postId);
    }
  }
  imageUrls:string='';
  loadPvData(id:number){
    this.postService.findPostById({'post-id':id})
      .subscribe({
        next:(post)=>{
          if (post.mediaUrl) {
            this.postService.getImage(post.mediaUrl).subscribe(
              (imageBlob) => {
                console.log('Image blob:', imageBlob);
                const imageUrl = URL.createObjectURL(imageBlob);
                this.imageUrls = imageUrl;
              },
              (error) => {
                console.error('Error fetching image:', error);
              }
            );
          }
          this.postForm.patchValue(post);
        },error: (error) => {
          console.error('Error loading station:', error);
        }
      });
  }

  onSave() {
    this.submitted = true;

    // Reset the message
    this.message = null;

    if (this.postForm.valid) {
      const postData = this.postForm.value;
      console.log(this.postForm.value);

      if (this.postId) {
        const param: UpdatePost$Params = {
          postId: this.postId,
          body: this.postForm.value
        };


        this.postService.updatePost(param).subscribe({
          next: () => {
            this.message = { type: 'success', text: 'Post updated successfully!' };
            this.router.navigate(['/profile-forum']);
            if (this.selectedPostCover) {
              this.postService.uploadPostCoverPicture({
                'post-id': this.postId as number,
                body: {file: this.selectedPostCover}
              }).subscribe({
                next: () => {
                  console.log('Cover image uploaded successfully');
                },
                error: (error) => {
                  console.error('Error uploading post cover:', error);
                  this.message = {type: 'error', text: 'Error uploading post cover. Please try again.'};
                  this.toastService.error(this.message.text, this.message.type);

                }
              });
            }
          },
          error: (error) => {
            console.error('Error updating post:', error);
            this.message = { type: 'error', text: 'Error updating post. Please try again.' };
            this.toastService.error(this.message.text, this.message.type);

          }
        });
      } else {
        this.safetyContentService.analyzeText(this.postForm.value.title+" " + this.postForm.value.content).subscribe({
          next: (analysis) => {
            const flaggedCategories = analysis.categoriesAnalysis.filter(
              (item) => item.severity > 0
            );

            if (flaggedCategories.length > 0) {
              this.message = {
                type: 'error',
                text: `Post contains inappropriate content: ${flaggedCategories.map(item => item.category).join(', ')}`
              };
              this.toastService.error(this.message.text, this.message.type);

            } else {
              // No flagged categories, proceed with saving the post
              this.postService.savePost({body: this.postForm.value}).subscribe({
                next: (postId) => {
                  this.message = {type: 'success', text: 'Post created successfully!'};
                  this.router.navigate(['/profile-forum']);

                  if (this.selectedPostCover) {
                    this.postService.uploadPostCoverPicture({
                      'post-id': postId,
                      body: {file: this.selectedPostCover}
                    }).subscribe({
                      next: () => {
                        console.log('Cover image uploaded successfully');
                      },
                      error: (error) => {
                        console.error('Error uploading post cover:', error);
                        this.message = {type: 'error', text: 'Error uploading post cover. Please try again.'};
                        this.toastService.error(this.message.text, this.message.type);

                      }
                    });
                  }
                },
                error: (error) => {
                  console.error('Error saving post:', error);
                  this.message = {type: 'error', text: 'Error creating post. Please try again.'};
                  this.toastService.error(this.message.text, this.message.type);

                }
              });
            }
          },
          error: (error) => {
            console.error('Error analyzing content:', error);
            this.message = {type: 'error', text: 'Error analyzing content. Please try again.'};
            this.toastService.error(this.message.text, this.message.type);

          }
        });
      }

    }
  }


  onCancel(): void {
    this.router.navigate(['/profile-forum']);
  }

  private initForm(): FormGroup {
    return this.fb.group({
      mediaUrl: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      visibility: [false],
      status: ['ACTIF', Validators.required]
    });
  }
  onFileSelected(event: any) {
    this.selectedPostCover = event.target.files[0];
    if (this.selectedPostCover) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture = reader.result as string;
      };
      reader.readAsDataURL(this.selectedPostCover);
    }
  }
}
