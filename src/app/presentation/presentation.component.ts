import {Component, EventEmitter, OnInit} from '@angular/core';
import { JasperoAlertsModule, AlertsService } from '@jaspero/ng2-alerts';
import {Router} from '@angular/router';
import {
    trigger,
    style,
    animate,
    transition
} from '@angular/animations';
import {AccountService} from '../accounts/account.service';
import {Account} from '../accounts/account.model';
import {UploadService} from '../accounts/upload.service';


declare var jquery:any;
declare var $:any;


@Component({
    selector: 'app-presentation',
    templateUrl: './presentation.component.html',
    styleUrls: ['./presentation.component.scss'],
    animations: [
        trigger('contact', [
            transition('void => *', [
                style({transform: 'scale3d(.3, .3, .3)'}),
                animate('500ms ease')
            ])
        ])
    ]
})

export class PresentationComponent implements OnInit {
    contactForm = false;
    accounts: Account[];
    images: any[];
    isDataAvailable: boolean;

    constructor(private _alert: AlertsService,
                private router: Router,
                private accountService: AccountService,
                private uploadService: UploadService) {

    }

    open(feature: boolean) {
        this.contactForm = true;
    }

    close() {
        this.router.navigate(['/landing']);
    }

    send() {
        this._alert.create('success', "Your information will be received by the title companies you selected", {
            overlay: true,
            overlayClickToClose: true,
            showCloseButton: true,
            duration: 5000
        });
        setTimeout(() => this.router.navigate(['/landing']), 1200);


    }


    ngOnInit() {
        this.isDataAvailable = false;
        this.accountService.getAccounts().subscribe(accounts => {
            console.log(accounts);
            this.accounts = accounts;
            this.isDataAvailable = true;
            this.images = [];
            for (const account of this.accounts) {
                if (account['image']) {
                    this.uploadService.getAccountImage(account).subscribe(image => {
                        account.data = image;
                    });
                }
            }

        });


//jQuery time
        var current_fs, next_fs, previous_fs; //fieldsets
        var left, opacity, scale; //fieldset properties which we will animate
        var animating; //flag to prevent quick multi-click glitches

        $(".next").click(function () {
            if (animating) return false;
            animating = true;

            current_fs = $(this).parent();
            next_fs = $(this).parent().next();


            //activate next step on progressbar using the index of next_fs
            $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

            //show the next fieldset
            next_fs.show();
            current_fs.hide();
            animating = false;


            //hide the current fieldset with style
            // current_fs.animate({opacity: 0}, {
            // 	step: function(now) {
            // 		console.log("now " + now);
            // 		//as the opacity of current_fs reduces to 0 - stored in "now"
            // 		//1. scale current_fs down to 80%
            // 		scale = 1 - (1 - now) * 0.2;
            // 		//2. bring next_fs from the right(50%)
            // 		left = (now * 50)+"%";
            // 		//3. increase opacity of next_fs to 1 as it moves in
            // 		opacity = 1 - now;
            // 		current_fs.css({
            //     'transform': 'scale(' + scale + ')',
            //     'position': 'absolute'
            //   });
            // 		next_fs.css({'left': left, 'opacity': opacity});
            // 	},
            // 	duration: 800,
            // 	complete: function(){
            // 		current_fs.hide();
            // 		animating = false;
            // 	},
            // 	//this comes from the custom easing plugin
            // 	easing: 'easeInOutBack'
            // });
        });

        $(".previous").click(function () {
            if (animating) return false;
            animating = true;

            current_fs = $(this).parent();
            previous_fs = $(this).parent().prev();

            //de-activate current step on progressbar
            $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

            //show the previous fieldset
            previous_fs.show();
            current_fs.hide();
            animating = false;
            //hide the current fieldset with style
// 	current_fs.animate({opacity: 0}, {
// 		step: function(now) {
// 			//as the opacity of current_fs reduces to 0 - stored in "now"
// 			//1. scale previous_fs from 80% to 100%
// 			scale = 0.8 + (1 - now) * 0.2;
// 			//2. take current_fs to the right(50%) - from 0%
// 			left = ((1 - now) * 50)+"%";
// 			//3. increase opacity of previous_fs to 1 as it moves in
// 			opacity = 1 - now;
// 			current_fs.css({'left': left});
// 			previous_fs.css({'transform': 'scale(' + scale + ')', 'opacity': opacity});
// 		},
// 		duration: 800,
// 		complete: function(){
// 			current_fs.hide();
// 			animating = false;
// 		},
// 		//this comes from the custom easing plugin
// 		easing: 'easeInOutBack'
// 	});
        });

        $(".submit").click(function () {
            return false;
        })


    }
}
