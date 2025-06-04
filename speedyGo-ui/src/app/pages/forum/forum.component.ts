import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {PageResponsePostResponse} from "../../services/models/page-response-post-response";
import {PostRequest} from "../../services/models/post-request";
import {PostService} from "../../services/services/post.service";
import {KeycloakService} from "../../utils/keycloak/keycloak.service";

import {NavbarComponent} from "../../components/navbar/navbar.component";
import {AdsListComponent} from "../../components/ads-list/ads-list.component";
import {AppBlogCardsComponent} from "../../components/blog-card/blog-card.component";
import {FooterComponent} from "../../components/footer/footer.component";

@Component({
  selector: 'app-forum',
    imports: [

        NavbarComponent,
        FormsModule,
        NgForOf,

        AdsListComponent,
        AppBlogCardsComponent,
        FooterComponent,
    ],
  templateUrl: './forum.component.html',
  standalone: true,
  styleUrl: './forum.component.scss'
})
export class ForumComponent implements OnInit{

  liked: boolean = false;
  postResponse: PageResponsePostResponse = {};
  page = 0;
  size = 5;
  pages: any = [];
  visible: boolean = false;
  selectedPostCover: any;
  selectedPicture: string | undefined;
  settingVisibility:boolean=false;
  isModalOpen: boolean = false;


  isPostModalOpen: boolean = false;
  isCommentModalOpen: boolean = false;
  commentContent: string = '';


  postRequest: PostRequest = {
    content: '',
    visibility: true,
    status: 'ACTIF',
    title:''
  }
  newComment: string = '';
  selectedPost: any = null;

  constructor(private postService: PostService, private keycloakService: KeycloakService) { }

  ngOnInit(): void {
    this.getAllPosts();
  }

  toggleLike(): void {
    this.liked = !this.liked;
  }

  showDialog() {
    this.visible = true;
  }

  getAllPosts() {
    this.postService.findAllPosts({ page: this.page, size: this.size }).subscribe({
      next: (posts) => {
        if (posts && posts.content) {
          this.postResponse = posts;
          this.pages = Array(this.postResponse.totalPages).fill(0).map((x, i) => i);
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







  openStings() {
      this.settingVisibility=true;
  }



  openModal() {
    this.isModalOpen = true;

  }

  closeModal() {
    this.isModalOpen = false;

  }

  openPostModal(post: any) {
    this.selectedPost = post;
    this.isPostModalOpen = true;
  }
  closePostModal() {
    this.isPostModalOpen = false;
  }
  editPost() {
    console.log('Éditer le post:', this.selectedPost);
    // Logique d'édition du post
  }
  deletePost() {
    console.log('Supprimer le post:', this.selectedPost);
    // Logique de suppression du post
  }

  openCommentModal(post: any) {
    this.selectedPost = post;
    this.isCommentModalOpen = true;
  }

  // Ferme la modale des commentaires
  post: PostRequest;
  closeCommentModal() {
    this.isCommentModalOpen = false;
  }

  postComment() {
    if (this.commentContent.trim()) {
      console.log('Commentaire ajouté:', this.commentContent);
      // Logique pour ajouter un commentaire ici
      this.commentContent = '';  // Réinitialiser après ajout
    }
  }

}
