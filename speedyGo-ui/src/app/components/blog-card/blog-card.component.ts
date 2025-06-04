import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import {Avatar} from "primeng/avatar";
import {PageResponsePostResponse} from "../../services/models/page-response-post-response";
import {PostRequest} from "../../services/models/post-request";
import {PostService} from "../../services/services/post.service";
import {KeycloakService} from "../../utils/keycloak/keycloak.service";
import {PostResponse} from "../../services/models/post-response";
import {MakeReactionForPost$Params} from "../../services/fn/post/make-reaction-for-post";
import {Button, ButtonDirective} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {FindAllCommentForPost$Params} from "../../services/fn/post/find-all-comment-for-post";
import {PageResponseComment} from "../../services/models/page-response-comment";
import {Card} from "primeng/card";
import {FormsModule} from "@angular/forms";
import {MakeCommentToPost$Params} from "../../services/fn/post/make-comment-to-post";
import {Comment} from "../../services/models/comment";
import {Textarea} from "primeng/textarea";
import {Menu} from "primeng/menu";
import {Paginator} from "primeng/paginator";
import {PageEvent} from "@angular/material/paginator";
import {SavePost$Params} from "../../services/fn/post/save-post";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Drawer} from "primeng/drawer";
import {ImageCompareModule} from "primeng/imagecompare";
import {Image} from "primeng/image";
import {Post} from "../../services/models/post";
import {AdsListComponent} from "../ads-list/ads-list.component";
import {RouterLink} from "@angular/router";
import {FooterComponent} from "../footer/footer.component";
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle
} from "@ng-bootstrap/ng-bootstrap";
import {UpdateCommentForPost$Params} from "../../services/fn/post/update-comment-for-post";
import {StoreService} from "../../store.service";
import {SafetyContentService} from "../blog-form/services/safety-content.service";
import {ToastrService} from "ngx-toastr";




@Component({
  selector: 'app-blog-card',
  imports: [MatCardModule, ImageCompareModule, TablerIconsModule, MatButtonModule, Avatar, Button, Dialog, Card, FormsModule, ButtonDirective, Textarea, Menu, Paginator, NgForOf, NgClass, Drawer, Image, AdsListComponent, RouterLink, FooterComponent, NgIf, NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.scss',
  standalone: true
})
export class AppBlogCardsComponent implements OnInit,AfterViewChecked{



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
  getUserId() {
    return this.keycloakService.userId;
  }

  editComment(comment: Comment) {
    this.newComment=comment.content!;
    this.cdr.detectChanges();

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


  shareAPostInYourProfile(post:PostResponse) {

    this.storeService.duplicatePost(post.id as number)
      .subscribe({
        next:()=>{
          this.getAllPosts();
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
  likedPosts: { [postId: number]: boolean } = {};
  visiblePost: boolean = false;
  pagePost = 0;
  sizePost = 5;
  pagesForPosts:any=[];



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

  message: { type: string, text: string } = { type: '', text: '' };

  constructor(private cdr: ChangeDetectorRef,private postService: PostService, private keycloakService: KeycloakService,private storeService:StoreService,private safetyContentService:SafetyContentService,private toastService:ToastrService) { }

  visible: boolean = false;

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

            console.log(this.comments.content);
          }
        });

  }

  ngOnInit(): void {
    this.getAllPosts();
    this.selectRandomImage();
  }
  randomImage: string = '';

  selectRandomImage() {
    const images = [
      'assets/1.jpg',
      'assets/2.jpg',
      'assets/3.png'
    ];

    // Randomly select one image
    const randomIndex = Math.floor(Math.random() * images.length);
    this.randomImage = images[randomIndex];
  }
  hasUserReacted(post: PostResponse): boolean {
    return post.reactions?.some(reaction => reaction.user?.id === this.keycloakService.userId) ?? false;
  }


  toggleReaction(post: PostResponse) {
    if (this.hasUserReacted(post)) {
      console.log(this.hasUserReacted(post));
      this.postService.deleteReaction({'postId':post.id!}).subscribe({
        next: () => {
          post.reactions = post.reactions?.filter(reaction => reaction.user?.id !== this.keycloakService.userId);
          this.getAllPosts();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de la réaction', err);
        }
      });
    } else {
      this.makeReactionForPost(post);


    }
  }


  imageUrls: string[] = [];



  getAllPosts() {
    this.postService.findAllPosts({ page: this.pagePost, size: this.sizePost }).subscribe({
      next: (posts) => {
        if (posts && posts.content) {
          this.postResponse = posts;
          console.log(posts.content);
          this.pagesForPosts = Array(posts.totalPages).fill(0)
            .map((x, i) => i);

          this.pages = Array(this.postResponse.totalPages).fill(0).map((x, i) => i);
          posts.content.forEach((post) => {
            if (post?.id !== undefined) {
              this.likedPosts[post.id] = post.reactions?.some(reaction => reaction.user?.id === this.keycloakService.userId) ?? false;
            }
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

    // Étape 1 : Analyse du contenu du commentaire
    this.safetyContentService.analyzeText(this.newComment).subscribe({
      next: (analysis) => {
        const flaggedCategories = analysis.categoriesAnalysis.filter(
          (item) => item.severity > 0
        );

        if (flaggedCategories.length > 0) {
          // Contenu inapproprié détecté
          this.message = {
            type: 'error',
            text: `Commentaire inapproprié détecté : ${flaggedCategories.map(item => item.category).join(', ')}`
          };
          this.toastService.error(this.message.text, this.message.type);

          return;
        }

        // Étape 2 : Envoi du commentaire
        const commentPayload: MakeCommentToPost$Params = {
          postId: this.selectedPost.id as number,
          body: {
            content: this.newComment,
            // postComment: this.selectedPost
          }
        };

        this.postService.makeCommentToPost(commentPayload).subscribe({
          next: () => {
            this.newComment = '';
            this.showDialog(this.selectedPost);
          },
          error: (err) => {
            console.error("Erreur lors de l'ajout du commentaire:", err);
            this.message = {
              type: 'error',
              text: "Erreur lors de l'ajout du commentaire. Veuillez réessayer."
            };
            this.toastService.error(this.message.text, this.message.type);

          }
        });
      },
      error: (error) => {
        console.error("Erreur lors de l'analyse du contenu:", error);
        this.message = {
          type: 'error',
          text: "Erreur lors de l'analyse du commentaire. Veuillez réessayer."
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
    console.log(this.selectedPost);
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

  ngAfterViewChecked(): void {
  }

/*<a routerLink="/widgets/cards">
    <!-- Si l'image est présente et que le sentiment est négatif, appliquer la classe 'blurred' -->
    <img width="100%" height="190px" class="cursor-pointer"
         *ngIf="imageUrls[i]"
         [src]="imageUrls[i]"
         alt="Post Image"
         [ngClass]="{'blurred': isNegativeSentiment}">
</a>
*/

  gotToPagePost(page: number) {
    this.pagePost = page;
    this.getAllPosts();

  }

  goToFirstPagePost() {
    this.pagePost = 0;
    this.getAllPosts();

  }

  goToPreviousPagePost() {
    this.pagePost --;
    this.getAllPosts();
  }

  goToLastPagePost() {
    this.pagePost = this.postResponse.totalPages as number - 1;
    this.getAllPosts();
  }

  goToNextPagePost() {
    this.pagePost++;
    this.getAllPosts();
  }

  get isLastPagePost() {

    return this.pagePost === this.postResponse.totalPages as number - 1;
  }


}
