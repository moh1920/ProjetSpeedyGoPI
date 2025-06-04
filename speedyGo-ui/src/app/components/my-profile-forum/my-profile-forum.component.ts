import {ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {Button, ButtonDirective, ButtonModule} from 'primeng/button';
import { Popover } from 'primeng/popover';
import {Tag, TagModule} from 'primeng/tag';
import {CommonModule, DecimalPipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import { TableModule } from 'primeng/table';
import { PostService } from '../../services/services/post.service';
import { Post } from '../../services/models/post';
import {Toast, ToastModule} from "primeng/toast";
import {ConfirmationService, MessageService} from "primeng/api";
import {ConfirmDialog, ConfirmDialogModule} from "primeng/confirmdialog";
import {AdsListComponent} from "../ads-list/ads-list.component";
import {Avatar} from "primeng/avatar";
import {Card} from "primeng/card";
import {Dialog, DialogModule} from "primeng/dialog";
import {Drawer} from "primeng/drawer";
import {Image} from "primeng/image";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {Textarea, TextareaModule} from "primeng/textarea";
import {PostResponse} from "../../services/models/post-response";
import {FindAllCommentForPost$Params} from "../../services/fn/post/find-all-comment-for-post";
import {MakeReactionForPost$Params} from "../../services/fn/post/make-reaction-for-post";
import {SavePost$Params} from "../../services/fn/post/save-post";
import {PostRequest} from "../../services/models/post-request";
import {PageResponsePostResponse} from "../../services/models/page-response-post-response";
import {PageResponseComment} from "../../services/models/page-response-comment";
import {Comment} from "../../services/models/comment";
import {KeycloakService} from "../../utils/keycloak/keycloak.service";
import {MakeCommentToPost$Params} from "../../services/fn/post/make-comment-to-post";
import {NavbarComponent} from "../navbar/navbar.component";
import {DeletePostByOwner$Params} from "../../services/fn/post/delete-post-by-owner";
import {UpdatePost$Params} from "../../services/fn/post/update-post";
import {Checkbox} from "primeng/checkbox";
import {DropdownModule} from "primeng/dropdown";
import {Select, SelectModule} from "primeng/select";
import {RadioButtonModule} from "primeng/radiobutton";
import {RippleModule} from "primeng/ripple";
import {ToolbarModule} from "primeng/toolbar";
import {RatingModule} from "primeng/rating";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {InputIconModule} from "primeng/inputicon";
import {IconFieldModule} from "primeng/iconfield";
import {EventPromotion} from "../../services/models/event-promotion";
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu, NgbDropdownModule,
  NgbDropdownToggle, NgbModal, NgbTooltipModule
} from "@ng-bootstrap/ng-bootstrap";
import {UpdateCommentForPost$Params} from "../../services/fn/post/update-comment-for-post";
import {FooterComponent} from "../footer/footer.component";
import {HttpClientModule} from "@angular/common/http";
import {SafetyContentService} from "../blog-form/services/safety-content.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-my-profile-forum',
  imports: [
    Button,
    Popover,
    Tag,
    NgIf,
    TableModule,
    Toast,
    ConfirmDialog,
    NgStyle,
    AdsListComponent,
    Avatar,
    ButtonDirective,
    Card,
    Dialog,
    Drawer,
    Image,
    MatCard,
    MatCardContent,
    MatCardTitle,
    NgForOf,
    ReactiveFormsModule,
    RouterLink,
    Textarea,
    FormsModule,
    NavbarComponent,
    Checkbox,
    DropdownModule,
    Select,
    RadioButtonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    Dialog, ButtonModule, InputTextModule, NgbDropdownModule,
    NgbTooltipModule,
    DecimalPipe, FooterComponent,

    CommonModule,
    HttpClientModule
  ],
  templateUrl: './my-profile-forum.component.html',
  standalone: true,
  styleUrl: './my-profile-forum.component.scss'
})
export class MyProfileForumComponent implements OnInit {


  message: { type: string, text: string } = { type: '', text: '' };
  private postss: PageResponsePostResponse= {};
  constructor(
    private postService: PostService, private keycloakService: KeycloakService,    private router: Router,private safetyContentService:SafetyContentService,private toastService:ToastrService
  ) {}


  posts: Post[] = [];
  mediaUrl:string;

  getUserId() {
    return this.keycloakService.userId;
  }

  imageUrls: string[] = [];

  ngOnInit() {
   this.findAllPostsByOwner();
    this.getUserId();
  }
  findAllPostsByOwner(){
    this.postService.findAllPostsByOwner(this.pagePost, this.sizePost).subscribe((posts) => {
      this.posts = posts.content || [];
      this.postss=posts;
      console.log(this.posts);
      this.pagesForPosts = Array(posts.totalPages).fill(0)
        .map((x, i) => i);

      this.posts.forEach(post => {
        this.postService.getImage(post.mediaUrl!).subscribe(
          (imageBlob) => {
            console.log('Image blob:', imageBlob);
            const imageUrl = URL.createObjectURL(imageBlob);
            this.imageUrls.push(imageUrl);
          },
          (error) => {
            console.error('Error fetching image:', error);
          }
        );

      });
    });
  }

  randomImage: string = '';

    showDialog(post:PostResponse) {
    this.visible = true;

    const params:FindAllCommentForPost$Params={
      page:this.page,
      size:this.size,
      postId:post.id as number
    }
    this.postService.findAllCommentForPost(params)
      .subscribe({
        next:(data)=>{
          this.comments=data;
          this.selectedPost = post;
          this.pagesForComments = Array(this.comments.totalPages)
            .fill(0)
            .map((x, i) => i);

        }
      });

  }


  addPV(): void {
    console.log('Navigating to add station page');
    this.router.navigate(['blog', 'add-post'])
      .then(success => console.log('Navigation result:', success))
      .catch(error => console.error('Navigation error:', error));
  }



  getSeverity(status: any) {
    switch (status) {
      case 'ACTIF':
        return 'success';
      case 'ARCHIVED':
        return 'warn';
      case 'DELETED':
        return 'danger';
      default:
        return 'success';
    }
  }



  makeReactionForPost(post:PostResponse) {
    const params:MakeReactionForPost$Params={
      postId:post.id as number,
      body:{
        typeReaction:'LIKE'
      }
    }
    this.postService.makeReactionForPost(params)
      .subscribe({
        next:()=>{
          if (post.id !== undefined) {
            this.likedPosts[post.id] = !this.likedPosts[post.id];
            this.getAllPosts();
          }

        }
      });
  }


  shareAPostInYourProfile(post:PostResponse) {
    const params:SavePost$Params={
      body:post as PostRequest
    }
    this.postService.savePost(params)
      .subscribe({
        next:()=>{
          console.log("Post added");
        }
      });

  }
  liked: boolean = false;
  postResponse: PageResponsePostResponse = {};
  page = 0;
  size = 5;
  pages: any = [];
  selectedPostCover: any;
  selectedPicture: string | undefined;
  comments:PageResponseComment={}
  comment:Comment;
  pagesForComments:any=[];
  pagesForPosts:any=[];
  likedPosts: { [postId: number]: boolean } = {};
  visiblePost: boolean = false;
  pagePost = 0;
  sizePost = 5;


  postRequest: PostRequest = {
    content: '',
    visibility: true,
    status: 'ACTIF',
    title:''
  }
  newComment: string = '';
  selectedPost: Post = {};
  openPostDrawer(post: PostResponse) {
    this.selectedPost = post;
    this.visiblePost = true;
  }


  visible: boolean = false;
  visibleEdit: boolean = false;
  visibleAdd: boolean = false;


  showDialogEdit(post:Post) {
    this.visibleEdit = true;

    const params:FindAllCommentForPost$Params={
      page:this.page,
      size:this.size,
      postId:post.id as number
    }
    this.postService.findAllCommentForPost(params)
      .subscribe({
        next:(data)=>{
          this.comments=data;
          this.selectedPost = post;
          this.pagesForComments = Array(this.comments.totalPages)
            .fill(0)
            .map((x, i) => i);

          console.log(this.comments.content);
        }
      });

  }


  deletePost(post:Post){
    const param:DeletePostByOwner$Params={
      postId:post.id as number
    }
    this.postService.deletePostByOwner(param).subscribe({
      next:()=>{
        this.postService.findAllPostsByOwner(this.page,this.size).subscribe((posts) => {
          this.posts = posts.content || [];
          this.router.navigate(['/profile-forum']);

        });
        console.log("Post deleted with success");
      }
    })
  }


  updatePost(post: Post) {
    const params: UpdatePost$Params = {
      postId: this.selectedPost.id as number,
      body: {
        ...post,
        title: this.selectedPost.title,
        content: this.selectedPost.content,
        status: this.selectedPost.status,
        visibility: this.selectedPost.visibility,
        mediaUrl: this.selectedPost.mediaUrl
      }
    };

    this.postService.updatePost(params)
      .subscribe({
        next: (post) => {
          this.postService.uploadPostCoverPicture({
            'post-id': this.selectedPost.id as number,
            body:{
              file:this.selectedPostCover
            }
          }).subscribe({
            next:()=>{

          }
          })
          this.postService.findAllPostsByOwner(this.page,this.size).subscribe((posts) => {
            this.posts = posts.content || [];
          });
          console.log("Post updated successfully");
          this.visibleEdit = false;
        },
        error: (err) => {
          console.error("Error updating post:", err);
        }
      });
  }





  getAllPosts() {
    this.postService.findAllPosts({ page: this.page, size: this.size }).subscribe({
      next: (posts) => {
        if (posts && posts.content) {
          this.postResponse = posts;
          console.log(posts.content);
          this.pages = Array(this.postResponse.totalPages).fill(0).map((x, i) => i);
          posts.content.forEach((post) => {
            if (post?.id !== undefined) {
              this.likedPosts[post.id] = post.reactions?.some(reaction => reaction.user?.id === this.keycloakService.userId) ?? false;
            }

          });
        } else {
          this.postResponse = { content: [] };
        }
      },
      error: (err) => {
        console.error("Erreur lors du chargement des posts:", err);
      }
    });
  }

  addPost() {
    if (!this.postRequest.content?.trim() || !this.postRequest.status?.trim()) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    this.postService.savePost({
      body: this.postRequest
    }).subscribe({
      next: (postId) => {
        if (this.selectedPostCover) {
          this.postService.uploadPostCoverPicture({
            'post-id': postId,
            body: { file: this.selectedPostCover }
          }).subscribe({
            next: () => {
              this.getAllPosts();
              this.visibleAdd=false;
              this.resetForm();
            }
          });
        } else {
          this.getAllPosts();
          this.resetForm();
        }
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout du post:", err);
      }
    });
  }

  resetForm() {
    this.postRequest = { content: '', visibility: true, status: 'ACTIF',title:'' };
    this.selectedPicture = undefined;
    this.selectedPostCover = undefined;
    this.visible = false;
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



  post: PostRequest;


  postComment() {
    if (!this.selectedPost) {
      console.error("Erreur: `selectedPost` est indéfini.");
      return;
    }

    if (!this.newComment?.trim()) {
      console.warn("Commentaire vide, rien à envoyer.");
      return;
    }

    this.safetyContentService.analyzeText(this.newComment).subscribe({
      next: (analysis) => {
        const flaggedCategories = analysis.categoriesAnalysis.filter(item => item.severity > 0);

        if (flaggedCategories.length > 0) {
          // Afficher un message d'erreur si contenu inapproprié
          this.message = {
            type: 'error',
            text: `Commentaire contient un contenu inapproprié: ${flaggedCategories.map(item => item.category).join(', ')}`
          };
          this.toastService.error(this.message.text, this.message.type);

        } else {
          // Si OK, on envoie le commentaire
          const commentPayload: MakeCommentToPost$Params = {
            postId: this.selectedPost.id as number,
            body: {
              content: this.newComment,
            }
          };

          this.postService.makeCommentToPost(commentPayload).subscribe({
            next: () => {
              this.newComment = '';
              this.showDialog(this.selectedPost);
            },
            error: (err) => console.error("Erreur lors de l'ajout du commentaire:", err)
          });
        }
      },
      error: (error) => {
        console.error('Erreur lors de l’analyse du commentaire:', error);
        this.message = {
          type: 'error',
          text: 'Erreur lors de l’analyse du commentaire. Veuillez réessayer.'
        };
        this.toastService.error(this.message.text, this.message.type);

      }
    });
  }




  gotToPage(page: number) {
    this.page = page;
    this.showDialog(this.selectedPost);
  }

  goToFirstPage() {
    this.page = 0;
    this.showDialog(this.selectedPost);
  }

  goToPreviousPage() {
    this.page --;
    this.showDialog(this.selectedPost);
  }

  goToLastPage() {
    this.page = this.comments.totalPages as number - 1;
    this.showDialog(this.selectedPost);
  }

  goToNextPage() {
    this.page++;
    this.showDialog(this.selectedPost);  }

  get isLastPage() {
    return this.page === this.comments.totalPages as number - 1;
  }


  showDialogAdd() {
      this.visibleAdd=true;
  }


  editPost(post: Post): void {
    this.router.navigate(['/blog/edit-post/', post.id]);
  }

  editComment(comment: Comment) {
    const params:UpdateCommentForPost$Params={
      commentId:comment.id as number,
      body:{
       content: this.newComment
      }
    }
      this.postService.updateCommentForPost(params).subscribe({
        next:()=>{

    }
      });
  }

  deleteComment(comment: Comment) {
    this.postService.deleteComment({commentId:comment.id as number}).subscribe({
      next:()=>{

      }
    });
  }


  getImageUrl(mediaUrl: string): string {
    if (!mediaUrl) return 'assets/default-image.png'; // Image par défaut si aucune image
    return 'http://localhost:8020/' + mediaUrl.replace(/\\/g, '/');
  }

  @ViewChild('deleteModal') deleteModal!: ElementRef;

  selectedPostForDelete: any;


  private modalService= inject(NgbModal);
  openConfirmModal(post: any) {
    this.selectedPostForDelete = post;
    this.modalService.open(this.deleteModal);
  }

  confirmDelete() {
    if (this.selectedPost) {
      this.deletePost(this.selectedPostForDelete);
      this.modalService.dismissAll();
    }
  }




  gotToPagePost(page: number) {
    this.pagePost = page;
    this.findAllPostsByOwner();

  }

  goToFirstPagePost() {
    this.pagePost = 0;
    this.findAllPostsByOwner();

  }

  goToPreviousPagePost() {
    this.pagePost --;
    this.findAllPostsByOwner();
  }

  goToLastPagePost() {
    this.pagePost = this.postss.totalPages as number - 1;
    this.findAllPostsByOwner();
  }

  goToNextPagePost() {
    this.pagePost++;
    this.findAllPostsByOwner();
    }

  get isLastPagePost() {

    return this.pagePost === this.postss.totalPages as number - 1;
  }





}
