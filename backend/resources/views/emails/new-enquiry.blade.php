<!doctype html>
<html lang="en">
<body style="font-family: Arial, Helvetica, sans-serif; color: #202B27; line-height: 1.6;">
    <h2 style="color: #174C3C; margin-bottom: 4px;">New website enquiry</h2>
    <p style="margin-top: 0; color: #66716A;">Received {{ $enquiry->created_at->format('j M Y, H:i') }}</p>

    <table cellpadding="6" style="border-collapse: collapse;">
        <tr><td><strong>Name</strong></td><td>{{ $enquiry->full_name }}</td></tr>
        <tr><td><strong>Email</strong></td><td>{{ $enquiry->email }}</td></tr>
        <tr><td><strong>Phone</strong></td><td>{{ $enquiry->phone }}</td></tr>
        <tr><td><strong>Subject</strong></td><td>{{ $enquiry->subject }}</td></tr>
    </table>

    <p style="margin-bottom: 4px;"><strong>Message</strong></p>
    <div style="padding: 12px 14px; background: #F7F8F5; border-radius: 6px;">
        {!! nl2br(e($enquiry->message)) !!}
    </div>

    <p style="margin-top: 20px;">
        Reply to this email to answer the visitor directly, or manage it in the
        <a href="{{ rtrim(config('app.url'), '/') }}/admin/enquiries" style="color: #39845F;">administration portal</a>.
    </p>

    <p style="color: #929B94; font-size: 12px;">
        This message contains personal information. Please do not forward it.
    </p>
</body>
</html>
